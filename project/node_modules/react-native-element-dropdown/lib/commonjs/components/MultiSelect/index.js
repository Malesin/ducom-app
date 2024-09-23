"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _assign2 = _interopRequireDefault(require("lodash/assign"));
var _differenceWith2 = _interopRequireDefault(require("lodash/differenceWith"));
var _get3 = _interopRequireDefault(require("lodash/get"));
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _toolkits = require("../../toolkits");
var _useDeviceOrientation = require("../../useDeviceOrientation");
var _TextInput = _interopRequireDefault(require("../TextInput"));
var _styles = require("./styles");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const {
  isTablet
} = _toolkits.useDetectDevice;
const ic_down = require('../../assets/down.png');
const statusBarHeight = _reactNative.StatusBar.currentHeight || 0;
const MultiSelectComponent = /*#__PURE__*/_react.default.forwardRef((props, currentRef) => {
  const orientation = (0, _useDeviceOrientation.useDeviceOrientation)();
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
  const ref = (0, _react.useRef)(null);
  const [visible, setVisible] = (0, _react.useState)(false);
  const [currentValue, setCurrentValue] = (0, _react.useState)([]);
  const [listData, setListData] = (0, _react.useState)(data);
  const [, setKey] = (0, _react.useState)(Math.random());
  const [position, setPosition] = (0, _react.useState)();
  const [keyboardHeight, setKeyboardHeight] = (0, _react.useState)(0);
  const [searchText, setSearchText] = (0, _react.useState)('');
  const {
    width: W,
    height: H
  } = _reactNative.Dimensions.get('window');
  const styleContainerVertical = (0, _react.useMemo)(() => {
    return {
      backgroundColor: 'rgba(0,0,0,0.1)',
      alignItems: 'center'
    };
  }, []);
  const styleHorizontal = (0, _react.useMemo)(() => {
    return {
      width: orientation === 'LANDSCAPE' ? W / 2 : '100%',
      alignSelf: 'center'
    };
  }, [W, orientation]);
  (0, _react.useImperativeHandle)(currentRef, () => {
    return {
      open: eventOpen,
      close: eventClose
    };
  });
  (0, _react.useEffect)(() => {
    return eventClose;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const excludeData = (0, _react.useCallback)(data => {
    if (excludeItems.length > 0) {
      const getData = (0, _differenceWith2.default)(data, excludeItems, (obj1, obj2) => (0, _get3.default)(obj1, valueField) === (0, _get3.default)(obj2, valueField));
      return getData || [];
    } else {
      return data || [];
    }
  }, [excludeItems, valueField]);
  (0, _react.useEffect)(() => {
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
  const font = (0, _react.useCallback)(() => {
    if (fontFamily) {
      return {
        fontFamily: fontFamily
      };
    } else {
      return {};
    }
  }, [fontFamily]);
  const getValue = (0, _react.useCallback)(() => {
    setCurrentValue(value ? [...value] : []);
  }, [value]);
  const _measure = (0, _react.useCallback)(() => {
    if (ref && ref !== null && ref !== void 0 && ref.current) {
      ref.current.measureInWindow((pageX, pageY, width, height) => {
        let isFull = isTablet ? false : mode === 'modal' || orientation === 'LANDSCAPE';
        if (mode === 'auto') {
          isFull = false;
        }
        const top = isFull ? 20 : height + pageY + 2;
        const bottom = H - top + height;
        const left = _reactNative.I18nManager.isRTL ? W - width - pageX : pageX;
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
  const onKeyboardDidShow = (0, _react.useCallback)(e => {
    _measure();
    setKeyboardHeight(e.endCoordinates.height);
  }, [_measure]);
  const onKeyboardDidHide = (0, _react.useCallback)(() => {
    setKeyboardHeight(0);
    _measure();
  }, [_measure]);
  (0, _react.useEffect)(() => {
    const susbcriptionKeyboardDidShow = _reactNative.Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const susbcriptionKeyboardDidHide = _reactNative.Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);
    return () => {
      if (typeof (susbcriptionKeyboardDidShow === null || susbcriptionKeyboardDidShow === void 0 ? void 0 : susbcriptionKeyboardDidShow.remove) === 'function') {
        susbcriptionKeyboardDidShow.remove();
      }
      if (typeof (susbcriptionKeyboardDidHide === null || susbcriptionKeyboardDidHide === void 0 ? void 0 : susbcriptionKeyboardDidHide.remove) === 'function') {
        susbcriptionKeyboardDidHide.remove();
      }
    };
  }, [onKeyboardDidHide, onKeyboardDidShow]);
  (0, _react.useEffect)(() => {
    getValue();
  }, [getValue, value]);
  const showOrClose = (0, _react.useCallback)(() => {
    if (!disable) {
      const visibleStatus = !visible;
      if (keyboardHeight > 0 && !visibleStatus) {
        return _reactNative.Keyboard.dismiss();
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
  const onSearch = (0, _react.useCallback)(text => {
    if (text.length > 0) {
      const defaultFilterFunction = e => {
        var _get2;
        const item = (_get2 = (0, _get3.default)(e, searchField || labelField)) === null || _get2 === void 0 ? void 0 : _get2.toLowerCase().replace(/\s/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const key = text.toLowerCase().replace(/\s/g, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return item.indexOf(key) >= 0;
      };
      const propSearchFunction = e => {
        const labelText = (0, _get3.default)(e, searchField || labelField);
        return searchQuery === null || searchQuery === void 0 ? void 0 : searchQuery(text, labelText);
      };
      const dataSearch = data.filter(searchQuery ? propSearchFunction : defaultFilterFunction);
      if (excludeSearchItems.length > 0 || excludeItems.length > 0) {
        const excludeSearchData = (0, _differenceWith2.default)(dataSearch, excludeSearchItems, (obj1, obj2) => (0, _get3.default)(obj1, valueField) === (0, _get3.default)(obj2, valueField));
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
  const onSelect = (0, _react.useCallback)(item => {
    const newCurrentValue = [...currentValue];
    const index = newCurrentValue.findIndex(e => e === (0, _get3.default)(item, valueField));
    if (index > -1) {
      newCurrentValue.splice(index, 1);
    } else {
      if (maxSelect) {
        if (newCurrentValue.length < maxSelect) {
          newCurrentValue.push((0, _get3.default)(item, valueField));
        }
      } else {
        newCurrentValue.push((0, _get3.default)(item, valueField));
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
    return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableWithoutFeedback, {
      testID: testID,
      accessible: !!accessibilityLabel,
      accessibilityLabel: accessibilityLabel,
      onPress: showOrClose
    }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: _styles.styles.dropdown
    }, renderLeftIcon === null || renderLeftIcon === void 0 ? void 0 : renderLeftIcon(visible), /*#__PURE__*/_react.default.createElement(_reactNative.Text, _extends({
      style: _reactNative.StyleSheet.flatten([_styles.styles.textItem, placeholderStyle, font()])
    }, selectedTextProps), placeholder), renderRightIcon ? renderRightIcon(visible) : /*#__PURE__*/_react.default.createElement(_reactNative.Image, {
      source: ic_down,
      style: _reactNative.StyleSheet.flatten([_styles.styles.icon, {
        tintColor: iconColor
      }, iconStyle])
    })));
  };
  const checkSelected = (0, _react.useCallback)(item => {
    const index = currentValue.findIndex(e => e === (0, _get3.default)(item, valueField));
    return index > -1;
  }, [currentValue, valueField]);
  const _renderItem = (0, _react.useCallback)(_ref => {
    let {
      item,
      index
    } = _ref;
    const selected = checkSelected(item);
    (0, _assign2.default)(item, {
      _index: index
    });
    return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableHighlight, {
      key: index.toString(),
      testID: (0, _get3.default)(item, itemTestIDField || labelField),
      accessible: !!accessibilityLabel,
      accessibilityLabel: (0, _get3.default)(item, itemAccessibilityLabelField || labelField),
      underlayColor: activeColor,
      onPress: () => onSelect(item)
    }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: _reactNative.StyleSheet.flatten([itemContainerStyle, selected && {
        backgroundColor: activeColor,
        ..._styles.styles.wrapItem
      }])
    }, renderItem ? renderItem(item, selected) : /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: _styles.styles.item
    }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: _reactNative.StyleSheet.flatten([_styles.styles.textItem, itemTextStyle, font()])
    }, (0, _get3.default)(item, labelField)))));
  }, [accessibilityLabel, activeColor, checkSelected, font, itemAccessibilityLabelField, itemContainerStyle, itemTestIDField, itemTextStyle, labelField, onSelect, renderItem]);
  const renderSearch = (0, _react.useCallback)(() => {
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
        return /*#__PURE__*/_react.default.createElement(_TextInput.default, {
          testID: testID + ' input',
          accessibilityLabel: accessibilityLabel + ' input',
          style: [_styles.styles.input, inputSearchStyle],
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
  const _renderList = (0, _react.useCallback)(isTopPosition => {
    const isInverted = !inverted ? false : isTopPosition;
    const _renderListHelper = () => {
      return /*#__PURE__*/_react.default.createElement(_reactNative.FlatList, _extends({
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
    return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableWithoutFeedback, null, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: _styles.styles.flexShrink
    }, isInverted && _renderListHelper(), renderSearch(), !isInverted && _renderListHelper()));
  }, [_renderItem, accessibilityLabel, flatListProps, listData, inverted, renderSearch, showsVerticalScrollIndicator, testID]);
  const _renderModal = (0, _react.useCallback)(() => {
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
        return /*#__PURE__*/_react.default.createElement(_reactNative.Modal, {
          transparent: true,
          statusBarTranslucent: true,
          visible: visible,
          supportedOrientations: ['landscape', 'portrait'],
          onRequestClose: showOrClose
        }, /*#__PURE__*/_react.default.createElement(_reactNative.TouchableWithoutFeedback, {
          onPress: showOrClose
        }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
          style: _reactNative.StyleSheet.flatten([_styles.styles.flex1, isFull && styleContainerVertical, backgroundColor && {
            backgroundColor: backgroundColor
          }, keyboardStyle])
        }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
          style: _reactNative.StyleSheet.flatten([_styles.styles.flex1, !isTopPosition ? {
            paddingTop: extendHeight
          } : {
            justifyContent: 'flex-end',
            paddingBottom: extendHeight
          }, isFull && _styles.styles.fullScreen])
        }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
          style: _reactNative.StyleSheet.flatten([_styles.styles.container, isFull ? styleHorizontal : styleVertical, {
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
      const check = value === null || value === void 0 ? void 0 : value.indexOf((0, _get3.default)(e, valueField));
      if (check !== -1) {
        return e;
      }
    });
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: _reactNative.StyleSheet.flatten([_styles.styles.rowSelectedItem, inside && _styles.styles.flex1])
    }, list.map(e => {
      if (renderSelectedItem) {
        return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableWithoutFeedback, {
          testID: (0, _get3.default)(e, itemTestIDField || labelField),
          accessible: !!accessibilityLabel,
          accessibilityLabel: (0, _get3.default)(e, itemAccessibilityLabelField || labelField),
          key: (0, _get3.default)(e, labelField),
          onPress: () => unSelect(e)
        }, renderSelectedItem(e, () => {
          unSelect(e);
        }));
      } else {
        return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableWithoutFeedback, {
          testID: (0, _get3.default)(e, itemTestIDField || labelField),
          accessible: !!accessibilityLabel,
          accessibilityLabel: (0, _get3.default)(e, itemAccessibilityLabelField || labelField),
          key: (0, _get3.default)(e, labelField),
          onPress: () => unSelect(e)
        }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
          style: _reactNative.StyleSheet.flatten([_styles.styles.selectedItem, selectedStyle])
        }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
          style: _reactNative.StyleSheet.flatten([_styles.styles.selectedTextLeftItem, selectedTextStyle, font()])
        }, (0, _get3.default)(e, labelField)), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
          style: _reactNative.StyleSheet.flatten([_styles.styles.selectedTextItem, selectedTextStyle])
        }, "\u24E7")));
      }
    }));
  };
  const _renderInside = () => {
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: _reactNative.StyleSheet.flatten([_styles.styles.mainWrap, style]),
      ref: ref,
      onLayout: _measure
    }, _renderDropdownInside(), _renderModal());
  };
  const _renderDropdownInside = () => {
    return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableWithoutFeedback, {
      testID: testID,
      accessible: !!accessibilityLabel,
      accessibilityLabel: accessibilityLabel,
      onPress: showOrClose
    }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: _styles.styles.dropdownInside
    }, renderLeftIcon === null || renderLeftIcon === void 0 ? void 0 : renderLeftIcon(), value && (value === null || value === void 0 ? void 0 : value.length) > 0 ? _renderItemSelected(true) : /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: _reactNative.StyleSheet.flatten([_styles.styles.textItem, placeholderStyle, font()])
    }, placeholder), renderRightIcon ? renderRightIcon() : /*#__PURE__*/_react.default.createElement(_reactNative.Image, {
      source: ic_down,
      style: _reactNative.StyleSheet.flatten([_styles.styles.icon, {
        tintColor: iconColor
      }, iconStyle])
    })));
  };
  if (inside) {
    return _renderInside();
  }
  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: _reactNative.StyleSheet.flatten([_styles.styles.mainWrap, style]),
    ref: ref,
    onLayout: _measure
  }, _renderDropdown(), _renderModal()), (!visible || alwaysRenderSelectedItem) && visibleSelectedItem && _renderItemSelected(false));
});
var _default = MultiSelectComponent;
exports.default = _default;
//# sourceMappingURL=index.js.map