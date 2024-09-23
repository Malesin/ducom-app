function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
/* eslint-disable @typescript-eslint/no-shadow */
import _assign from 'lodash/assign';
import _differenceWith from 'lodash/differenceWith';
import _findIndex from 'lodash/findIndex';
import _get from 'lodash/get';
import _isEqual from 'lodash/isEqual';
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
const DropdownComponent = /*#__PURE__*/React.forwardRef((props, currentRef) => {
  const orientation = useDeviceOrientation();
  const {
    testID,
    itemTestIDField,
    onChange,
    style = {},
    containerStyle,
    placeholderStyle,
    selectedTextStyle,
    itemContainerStyle,
    itemTextStyle,
    inputSearchStyle,
    iconStyle,
    selectedTextProps = {},
    data = [],
    labelField,
    valueField,
    searchField,
    value,
    activeColor = '#F6F7F8',
    fontFamily,
    iconColor = 'gray',
    searchPlaceholder,
    placeholder = 'Select item',
    search = false,
    maxHeight = 340,
    minHeight = 0,
    disable = false,
    keyboardAvoiding = true,
    inverted = true,
    renderLeftIcon,
    renderRightIcon,
    renderItem,
    renderInputSearch,
    onFocus,
    onBlur,
    autoScroll = true,
    showsVerticalScrollIndicator = true,
    dropdownPosition = 'auto',
    flatListProps,
    searchQuery,
    backgroundColor,
    onChangeText,
    confirmSelectItem,
    onConfirmSelectItem,
    accessibilityLabel,
    itemAccessibilityLabelField,
    mode = 'default',
    closeModalWhenSelectedItem = true,
    excludeItems = [],
    excludeSearchItems = []
  } = props;
  const ref = useRef(null);
  const refList = useRef(null);
  const [visible, setVisible] = useState(false);
  const [currentValue, setCurrentValue] = useState(null);
  const [listData, setListData] = useState(data);
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
      scrollIndex();
    }
  };
  const eventClose = useCallback(() => {
    if (!disable) {
      setVisible(false);
      if (onBlur) {
        onBlur();
      }
    }
  }, [disable, onBlur]);
  const font = useCallback(() => {
    if (fontFamily) {
      return {
        fontFamily: fontFamily
      };
    } else {
      return {};
    }
  }, [fontFamily]);
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
  const getValue = useCallback(() => {
    const defaultValue = typeof value === 'object' ? _get(value, valueField) : value;
    const getItem = data.filter(e => _isEqual(defaultValue, _get(e, valueField)));
    if (getItem.length > 0) {
      setCurrentValue(getItem[0]);
    } else {
      setCurrentValue(null);
    }
  }, [data, value, valueField]);
  useEffect(() => {
    getValue();
  }, [value, data, getValue]);
  const scrollIndex = useCallback(() => {
    if (autoScroll && (data === null || data === void 0 ? void 0 : data.length) > 0 && (listData === null || listData === void 0 ? void 0 : listData.length) === (data === null || data === void 0 ? void 0 : data.length)) {
      setTimeout(() => {
        if (refList && refList !== null && refList !== void 0 && refList.current) {
          const defaultValue = typeof value === 'object' ? _get(value, valueField) : value;
          const index = _findIndex(listData, e => _isEqual(defaultValue, _get(e, valueField)));
          if ((listData === null || listData === void 0 ? void 0 : listData.length) > 0 && index > -1 && index <= (listData === null || listData === void 0 ? void 0 : listData.length) - 1) {
            try {
              refList.current.scrollToIndex({
                index: index,
                animated: false
              });
            } catch (error) {
              console.warn(`scrollToIndex error: ${error}`);
            }
          }
        }
      }, 200);
    }
  }, [autoScroll, data.length, listData, value, valueField]);
  const showOrClose = useCallback(() => {
    if (!disable) {
      const visibleStatus = !visible;
      if (keyboardHeight > 0 && !visibleStatus) {
        return Keyboard.dismiss();
      }
      if (!visibleStatus) {
        if (onChangeText) {
          onChangeText('');
        }
        setSearchText('');
        onSearch('');
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
      scrollIndex();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disable, keyboardHeight, visible, _measure, data, searchText, scrollIndex, onFocus, onBlur]);
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
    if (confirmSelectItem && onConfirmSelectItem) {
      return onConfirmSelectItem(item);
    }
    setCurrentValue(item);
    onChange(item);
    if (closeModalWhenSelectedItem) {
      if (onChangeText) {
        onChangeText('');
      }
      setSearchText('');
      onSearch('');
      eventClose();
    }
  }, [confirmSelectItem, eventClose, onChange, onChangeText, onConfirmSelectItem, onSearch, closeModalWhenSelectedItem]);
  const _renderDropdown = () => {
    const isSelected = currentValue && _get(currentValue, valueField);
    return /*#__PURE__*/React.createElement(TouchableWithoutFeedback, {
      testID: testID,
      accessible: !!accessibilityLabel,
      accessibilityLabel: accessibilityLabel,
      onPress: showOrClose
    }, /*#__PURE__*/React.createElement(View, {
      style: styles.dropdown
    }, renderLeftIcon === null || renderLeftIcon === void 0 ? void 0 : renderLeftIcon(visible), /*#__PURE__*/React.createElement(Text, _extends({
      style: [styles.textItem, isSelected !== null ? selectedTextStyle : placeholderStyle, font()]
    }, selectedTextProps), isSelected !== null ? _get(currentValue, labelField) : placeholder), renderRightIcon ? renderRightIcon(visible) : /*#__PURE__*/React.createElement(Image, {
      source: ic_down,
      style: StyleSheet.flatten([styles.icon, {
        tintColor: iconColor
      }, iconStyle])
    })));
  };
  const _renderItem = useCallback(_ref => {
    let {
      item,
      index
    } = _ref;
    const isSelected = currentValue && _get(currentValue, valueField);
    const selected = _isEqual(_get(item, valueField), isSelected);
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
        backgroundColor: activeColor
      }])
    }, renderItem ? renderItem(item, selected) : /*#__PURE__*/React.createElement(View, {
      style: styles.item
    }, /*#__PURE__*/React.createElement(Text, {
      style: StyleSheet.flatten([styles.textItem, itemTextStyle, font()])
    }, _get(item, labelField)))));
  }, [accessibilityLabel, activeColor, currentValue, font, itemAccessibilityLabelField, itemContainerStyle, itemTestIDField, itemTextStyle, labelField, onSelect, renderItem, valueField]);
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
          value: searchText,
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
  }, [accessibilityLabel, font, iconColor, iconStyle, inputSearchStyle, onChangeText, onSearch, renderInputSearch, search, searchPlaceholder, testID, searchText]);
  const _renderList = useCallback(isTopPosition => {
    const isInverted = !inverted ? false : isTopPosition;
    const _renderListHelper = () => {
      return /*#__PURE__*/React.createElement(FlatList, _extends({
        testID: testID + ' flatlist',
        accessibilityLabel: accessibilityLabel + ' flatlist'
      }, flatListProps, {
        keyboardShouldPersistTaps: "handled",
        ref: refList,
        onScrollToIndexFailed: scrollIndex,
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
  }, [_renderItem, accessibilityLabel, flatListProps, listData, inverted, renderSearch, scrollIndex, showsVerticalScrollIndicator, testID]);
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
  return /*#__PURE__*/React.createElement(View, {
    style: StyleSheet.flatten([styles.mainWrap, style]),
    ref: ref,
    onLayout: _measure
  }, _renderDropdown(), _renderModal());
});
export default DropdownComponent;
//# sourceMappingURL=index.js.map