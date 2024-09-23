function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/* eslint-disable @typescript-eslint/no-shadow */
import _assign from 'lodash/assign';
import _differenceWith from 'lodash/differenceWith';
import _get from 'lodash/get';
import React, { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Dimensions, FlatList, I18nManager, Image, Keyboard, Modal, StyleSheet, Text, TouchableHighlight, TouchableWithoutFeedback, View, StatusBar } from 'react-native';
import { useDetectDevice } from '../../toolkits';
import { useDeviceOrientation } from '../../useDeviceOrientation';
import CInput from '../TextInput';
import { styles } from './styles';
const {
  isTablet
} = useDetectDevice;
const ic_down = require('../../assets/down.png');
const statusBarHeight = StatusBar.currentHeight || 0;
const MultiSelectComponent = /*#__PURE__*/React.forwardRef((props, currentRef) => {
  const orientation = useDeviceOrientation();
  const {
    testID,
    itemTestIDField,
    onChange,
    data = [],
    value,
    style = {},
    labelField,
    valueField,
    searchField,
    selectedStyle,
    selectedTextStyle,
    itemContainerStyle,
    itemTextStyle,
    iconStyle,
    selectedTextProps = {},
    activeColor = '#F6F7F8',
    containerStyle,
    fontFamily,
    placeholderStyle,
    iconColor = 'gray',
    inputSearchStyle,
    searchPlaceholder,
    placeholder = 'Select item',
    search = false,
    maxHeight = 340,
    minHeight = 0,
    maxSelect,
    disable = false,
    keyboardAvoiding = true,
    inside = false,
    inverted = true,
    renderItem,
    renderLeftIcon,
    renderRightIcon,
    renderSelectedItem,
    renderInputSearch,
    onFocus,
    onBlur,
    showsVerticalScrollIndicator = true,
    dropdownPosition = 'auto',
    flatListProps,
    alwaysRenderSelectedItem = false,
    searchQuery,
    backgroundColor,
    onChangeText,
    confirmSelectItem,
    confirmUnSelectItem,
    onConfirmSelectItem,
    accessibilityLabel,
    itemAccessibilityLabelField,
    visibleSelectedItem = true,
    mode = 'default',
    excludeItems = [],
    excludeSearchItems = []
  } = props;
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [currentValue, setCurrentValue] = useState([]);
  const [listData, setListData] = useState(data);
  const [, setKey] = useState(Math.random());
  const [position, setPosition] = useState();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [searchText, setSearchText] = useState('');
  const {
    width: W,
    height: H
  } = Dimensions.get('window');
  const styleContainerVertical = useMemo(() => {
    return {
      backgroundColor: 'rgba(0,0,0,0.1)',
      alignItems: 'center'
    };
  }, []);
  const styleHorizontal = useMemo(() => {
    return {
      width: orientation === 'LANDSCAPE' ? W / 2 : '100%',
      alignSelf: 'center'
    };
  }, [W, orientation]);
  useImperativeHandle(currentRef, () => {
    return {
      open: eventOpen,
      close: eventClose
    };
  });
  useEffect(() => {
    return eventClose;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const excludeData = useCallback(data => {
    if (excludeItems.length > 0) {
      const getData = _differenceWith(data, excludeItems, (obj1, obj2) => _get(obj1, valueField) === _get(obj2, valueField));
      return getData || [];
    } else {
      return data || [];
    }
  }, [excludeItems, valueField]);
  useEffect(() => {
    const filterData = excludeData(data);
    setListData([...filterData]);
    if (searchText) {
      onSearch(searchText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, searchText]);
  const eventOpen = () => {
    if (!disable) {
      setVisible(true);
      if (onFocus) {
        onFocus();
      }
      if (searchText.length > 0) {
        onSearch(searchText);
      }
    }
  };
  const eventClose = () => {
    if (!disable) {
      setVisible(false);
      if (onBlur) {
        onBlur();
      }
    }
  };
  const font = useCallback(() => {
    if (fontFamily) {
      return {
        fontFamily: fontFamily
      };
    } else {
      return {};
    }
  }, [fontFamily]);
  const getValue = useCallback(() => {
    setCurrentValue(value ? [...value] : []);
  }, [value]);
  const _measure = useCallback(() => {
    if (ref && ref !== null && ref !== void 0 && ref.current) {
      ref.current.measureInWindow((pageX, pageY, width, height) => {
        let isFull = isTablet ? false : mode === 'modal' || orientation === 'LANDSCAPE';
        if (mode === 'auto') {
          isFull = false;
        }
        const top = isFull ? 20 : height + pageY + 2;
        const bottom = H - top + height;
        const left = I18nManager.isRTL ? W - width - pageX : pageX;
        setPosition({
          isFull,
          width: Math.floor(width),
          top: Math.floor(top + statusBarHeight),
          bottom: Math.floor(bottom - statusBarHeight),
          left: Math.floor(left),
          height: Math.floor(height)
        });
      });
    }
  }, [H, W, orientation, mode]);
  const onKeyboardDidShow = useCallback(e => {
    _measure();
    setKeyboardHeight(e.endCoordinates.height);
  }, [_measure]);
  const onKeyboardDidHide = useCallback(() => {
    setKeyboardHeight(0);
    _measure();
  }, [_measure]);
  useEffect(() => {
    const susbcriptionKeyboardDidShow = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const susbcriptionKeyboardDidHide = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return () => {
      if (typeof (susbcriptionKeyboardDidShow === null || susbcriptionKeyboardDidShow === void 0 ? void 0 : susbcriptionKeyboardDidShow.remove) === 'function') {
        susbcriptionKeyboardDidShow.remove();
      }
      if (typeof (susbcriptionKeyboardDidHide === null || susbcriptionKeyboardDidHide === void 0 ? void 0 : susbcriptionKeyboardDidHide.remove) === 'function') {
        susbcriptionKeyboardDidHide.remove();
      }
    };
  }, [onKeyboardDidHide, onKeyboardDidShow]);
  useEffect(() => {
    getValue();
  }, [getValue, value]);
  const showOrClose = useCallback(() => {
    if (!disable) {
      const visibleStatus = !visible;
      if (keyboardHeight > 0 && !visibleStatus) {
        return Keyboard.dismiss();
      }
      _measure();
      setVisible(visibleStatus);
      const filterData = excludeData(data);
      setListData(filterData);
      if (visibleStatus) {
        if (onFocus) {
          onFocus();
        }
      } else {
        if (onBlur) {
          onBlur();
        }
      }
      if (searchText.length > 0) {
        onSearch(searchText);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disable, keyboardHeight, visible, _measure, data, searchText, onFocus, onBlur]);
  const onSearch = useCallback(text => {
    if (text.length > 0) {
      const defaultFilterFunction = e => {
        var _get2;
        const item = (_get2 = _get(e, searchField || labelField)) === null || _get2 === void 0 ? void 0 : _get2.toLowerCase().replace(/\s/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const key = text.toLowerCase().replace(/\s/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return item.indexOf(key) >= 0;
      };
      const propSearchFunction = e => {
        const labelText = _get(e, searchField || labelField);
        return searchQuery === null || searchQuery === void 0 ? void 0 : searchQuery(text, labelText);
      };
      const dataSearch = data.filter(searchQuery ? propSearchFunction : defaultFilterFunction);
      if (excludeSearchItems.length > 0 || excludeItems.length > 0) {
        const excludeSearchData = _differenceWith(dataSearch, excludeSearchItems, (obj1, obj2) => _get(obj1, valueField) === _get(obj2, valueField));
        const filterData = excludeData(excludeSearchData);
        setListData(filterData);
      } else {
        setListData(dataSearch);
      }
    } else {
      const filterData = excludeData(data);
      setListData(filterData);
    }
  }, [data, searchQuery, excludeSearchItems, excludeItems, searchField, labelField, valueField, excludeData]);
  const onSelect = useCallback(item => {
    const newCurrentValue = [...currentValue];
    const index = newCurrentValue.findIndex(e => e === _get(item, valueField));
    if (index > -1) {
      newCurrentValue.splice(index, 1);
    } else {
      if (maxSelect) {
        if (newCurrentValue.length < maxSelect) {
          newCurrentValue.push(_get(item, valueField));
        }
      } else {
        newCurrentValue.push(_get(item, valueField));
      }
    }
    if (onConfirmSelectItem) {
      if (index > -1) {
        if (confirmUnSelectItem) {
          onConfirmSelectItem(newCurrentValue);
        } else {
          onChange(newCurrentValue);
        }
      } else {
        if (confirmSelectItem) {
          onConfirmSelectItem(newCurrentValue);
        } else {
          onChange(newCurrentValue);
        }
      }
    } else {
      onChange(newCurrentValue);
    }
    setKey(Math.random());
  }, [confirmSelectItem, confirmUnSelectItem, currentValue, maxSelect, onChange, onConfirmSelectItem, valueField]);
  const _renderDropdown = () => {
    return /*#__PURE__*/React.createElement(TouchableWithoutFeedback, {
      testID: testID,
      accessible: !!accessibilityLabel,
      accessibilityLabel: accessibilityLabel,
      onPress: showOrClose
    }, /*#__PURE__*/React.createElement(View, {
      style: styles.dropdown
    }, renderLeftIcon === null || renderLeftIcon === void 0 ? void 0 : renderLeftIcon(visible), /*#__PURE__*/React.createElement(Text, _extends({
      style: StyleSheet.flatten([styles.textItem, placeholderStyle, font()])
    }, selectedTextProps), placeholder), renderRightIcon ? renderRightIcon(visible) : /*#__PURE__*/React.createElement(Image, {
      source: ic_down,
      style: StyleSheet.flatten([styles.icon, {
        tintColor: iconColor
      }, iconStyle])
    })));
  };
  const checkSelected = useCallback(item => {
    const index = currentValue.findIndex(e => e === _get(item, valueField));
    return index > -1;
  }, [currentValue, valueField]);
  const _renderItem = useCallback(_ref => {
    let {
      item,
      index
    } = _ref;
    const selected = checkSelected(item);
    _assign(item, {
      _index: index
    });
    return /*#__PURE__*/React.createElement(TouchableHighlight, {
      key: index.toString(),
      testID: _get(item, itemTestIDField || labelField),
      accessible: !!accessibilityLabel,
      accessibilityLabel: _get(item, itemAccessibilityLabelField || labelField),
      underlayColor: activeColor,
      onPress: () => onSelect(item)
    }, /*#__PURE__*/React.createElement(View, {
      style: StyleSheet.flatten([itemContainerStyle, selected && {
        backgroundColor: activeColor,
        ...styles.wrapItem
      }])
    }, renderItem ? renderItem(item, selected) : /*#__PURE__*/React.createElement(View, {
      style: styles.item
    }, /*#__PURE__*/React.createElement(Text, {
      style: StyleSheet.flatten([styles.textItem, itemTextStyle, font()])
    }, _get(item, labelField)))));
  }, [accessibilityLabel, activeColor, checkSelected, font, itemAccessibilityLabelField, itemContainerStyle, itemTestIDField, itemTextStyle, labelField, onSelect, renderItem]);
  const renderSearch = useCallback(() => {
    if (search) {
      if (renderInputSearch) {
        return renderInputSearch(text => {
          if (onChangeText) {
            setSearchText(text);
            onChangeText(text);
          }
          onSearch(text);
        });
      } else {
        return /*#__PURE__*/React.createElement(CInput, {
          testID: testID + ' input',
          accessibilityLabel: accessibilityLabel + ' input',
          style: [styles.input, inputSearchStyle],
          inputStyle: [inputSearchStyle, font()],
          autoCorrect: false,
          placeholder: searchPlaceholder,
          onChangeText: e => {
            if (onChangeText) {
              setSearchText(e);
              onChangeText(e);
            }
            onSearch(e);
          },
          placeholderTextColor: "gray",
          iconStyle: [{
            tintColor: iconColor
          }, iconStyle]
        });
      }
    }
    return null;
  }, [accessibilityLabel, font, iconColor, iconStyle, inputSearchStyle, onChangeText, onSearch, renderInputSearch, search, searchPlaceholder, testID]);
  const _renderList = useCallback(isTopPosition => {
    const isInverted = !inverted ? false : isTopPosition;
    const _renderListHelper = () => {
      return /*#__PURE__*/React.createElement(FlatList, _extends({
        testID: testID + ' flatlist',
        accessibilityLabel: accessibilityLabel + ' flatlist'
      }, flatListProps, {
        keyboardShouldPersistTaps: "handled",
        data: listData,
        inverted: isTopPosition ? inverted : false,
        renderItem: _renderItem,
        keyExtractor: (_item, index) => index.toString(),
        showsVerticalScrollIndicator: showsVerticalScrollIndicator
      }));
    };
    return /*#__PURE__*/React.createElement(TouchableWithoutFeedback, null, /*#__PURE__*/React.createElement(View, {
      style: styles.flexShrink
    }, isInverted && _renderListHelper(), renderSearch(), !isInverted && _renderListHelper()));
  }, [_renderItem, accessibilityLabel, flatListProps, listData, inverted, renderSearch, showsVerticalScrollIndicator, testID]);
  const _renderModal = useCallback(() => {
    if (visible && position) {
      const {
        isFull,
        width,
        height,
        top,
        bottom,
        left
      } = position;
      const onAutoPosition = () => {
        if (keyboardHeight > 0) {
          return bottom < keyboardHeight + height;
        }
        return bottom < (search ? 150 : 100);
      };
      if (width && top && bottom) {
        const styleVertical = {
          left: left,
          maxHeight: maxHeight,
          minHeight: minHeight
        };
        const isTopPosition = dropdownPosition === 'auto' ? onAutoPosition() : dropdownPosition === 'top';
        let keyboardStyle = {};
        let extendHeight = !isTopPosition ? top : bottom;
        if (keyboardAvoiding && keyboardHeight > 0 && isTopPosition && dropdownPosition === 'auto') {
          extendHeight = keyboardHeight;
        }
        return /*#__PURE__*/React.createElement(Modal, {
          transparent: true,
          statusBarTranslucent: true,
          visible: visible,
          supportedOrientations: ['landscape', 'portrait'],
          onRequestClose: showOrClose
        }, /*#__PURE__*/React.createElement(TouchableWithoutFeedback, {
          onPress: showOrClose
        }, /*#__PURE__*/React.createElement(View, {
          style: StyleSheet.flatten([styles.flex1, isFull && styleContainerVertical, backgroundColor && {
            backgroundColor: backgroundColor
          }, keyboardStyle])
        }, /*#__PURE__*/React.createElement(View, {
          style: StyleSheet.flatten([styles.flex1, !isTopPosition ? {
            paddingTop: extendHeight
          } : {
            justifyContent: 'flex-end',
            paddingBottom: extendHeight
          }, isFull && styles.fullScreen])
        }, /*#__PURE__*/React.createElement(View, {
          style: StyleSheet.flatten([styles.container, isFull ? styleHorizontal : styleVertical, {
            width
          }, containerStyle])
        }, _renderList(isTopPosition))))));
      }
      return null;
    }
    return null;
  }, [visible, search, position, keyboardHeight, maxHeight, minHeight, dropdownPosition, keyboardAvoiding, showOrClose, styleContainerVertical, backgroundColor, containerStyle, styleHorizontal, _renderList]);
  const unSelect = item => {
    if (!disable) {
      onSelect(item);
    }
  };
  const _renderItemSelected = inside => {
    const list = data.filter(e => {
      const check = value === null || value === void 0 ? void 0 : value.indexOf(_get(e, valueField));
      if (check !== -1) {
        return e;
      }
    });
    return /*#__PURE__*/React.createElement(View, {
      style: StyleSheet.flatten([styles.rowSelectedItem, inside && styles.flex1])
    }, list.map(e => {
      if (renderSelectedItem) {
        return /*#__PURE__*/React.createElement(TouchableWithoutFeedback, {
          testID: _get(e, itemTestIDField || labelField),
          accessible: !!accessibilityLabel,
          accessibilityLabel: _get(e, itemAccessibilityLabelField || labelField),
          key: _get(e, labelField),
          onPress: () => unSelect(e)
        }, renderSelectedItem(e, () => {
          unSelect(e);
        }));
      } else {
        return /*#__PURE__*/React.createElement(TouchableWithoutFeedback, {
          testID: _get(e, itemTestIDField || labelField),
          accessible: !!accessibilityLabel,
          accessibilityLabel: _get(e, itemAccessibilityLabelField || labelField),
          key: _get(e, labelField),
          onPress: () => unSelect(e)
        }, /*#__PURE__*/React.createElement(View, {
          style: StyleSheet.flatten([styles.selectedItem, selectedStyle])
        }, /*#__PURE__*/React.createElement(Text, {
          style: StyleSheet.flatten([styles.selectedTextLeftItem, selectedTextStyle, font()])
        }, _get(e, labelField)), /*#__PURE__*/React.createElement(Text, {
          style: StyleSheet.flatten([styles.selectedTextItem, selectedTextStyle])
        }, "\u24E7")));
      }
    }));
  };
  const _renderInside = () => {
    return /*#__PURE__*/React.createElement(View, {
      style: StyleSheet.flatten([styles.mainWrap, style]),
      ref: ref,
      onLayout: _measure
    }, _renderDropdownInside(), _renderModal());
  };
  const _renderDropdownInside = () => {
    return /*#__PURE__*/React.createElement(TouchableWithoutFeedback, {
      testID: testID,
      accessible: !!accessibilityLabel,
      accessibilityLabel: accessibilityLabel,
      onPress: showOrClose
    }, /*#__PURE__*/React.createElement(View, {
      style: styles.dropdownInside
    }, renderLeftIcon === null || renderLeftIcon === void 0 ? void 0 : renderLeftIcon(), value && (value === null || value === void 0 ? void 0 : value.length) > 0 ? _renderItemSelected(true) : /*#__PURE__*/React.createElement(Text, {
      style: StyleSheet.flatten([styles.textItem, placeholderStyle, font()])
    }, placeholder), renderRightIcon ? renderRightIcon() : /*#__PURE__*/React.createElement(Image, {
      source: ic_down,
      style: StyleSheet.flatten([styles.icon, {
        tintColor: iconColor
      }, iconStyle])
    })));
  };
  if (inside) {
    return _renderInside();
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(View, {
    style: StyleSheet.flatten([styles.mainWrap, style]),
    ref: ref,
    onLayout: _measure
  }, _renderDropdown(), _renderModal()), (!visible || alwaysRenderSelectedItem) && visibleSelectedItem && _renderItemSelected(false));
});
export default MultiSelectComponent;
//# sourceMappingURL=index.js.map