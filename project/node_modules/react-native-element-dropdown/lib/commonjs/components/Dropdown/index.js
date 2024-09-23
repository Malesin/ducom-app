"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _assign2 = _interopRequireDefault(require("lodash/assign"));
var _differenceWith2 = _interopRequireDefault(require("lodash/differenceWith"));
var _findIndex2 = _interopRequireDefault(require("lodash/findIndex"));
var _get3 = _interopRequireDefault(require("lodash/get"));
var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));
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
const DropdownComponent = /*#__PURE__*/_react.default.forwardRef((props, currentRef) => {
  const orientation = (0, _useDeviceOrientation.useDeviceOrientation)();
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
  const ref = (0, _react.useRef)(null);
  const refList = (0, _react.useRef)(null);
  const [visible, setVisible] = (0, _react.useState)(false);
  const [currentValue, setCurrentValue] = (0, _react.useState)(null);
  const [listData, setListData] = (0, _react.useState)(data);
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
      scrollIndex();
    }
  };
  const eventClose = (0, _react.useCallback)(() => {
    if (!disable) {
      setVisible(false);
      if (onBlur) {
        onBlur();
      }
    }
  }, [disable, onBlur]);
  const font = (0, _react.useCallback)(() => {
    if (fontFamily) {
      return {
        fontFamily: fontFamily
      };
    } else {
      return {};
    }
  }, [fontFamily]);
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
  const getValue = (0, _react.useCallback)(() => {
    const defaultValue = typeof value === 'object' ? (0, _get3.default)(value, valueField) : value;
    const getItem = data.filter(e => (0, _isEqual2.default)(defaultValue, (0, _get3.default)(e, valueField)));
    if (getItem.length > 0) {
      setCurrentValue(getItem[0]);
    } else {
      setCurrentValue(null);
    }
  }, [data, value, valueField]);
  (0, _react.useEffect)(() => {
    getValue();
  }, [value, data, getValue]);
  const scrollIndex = (0, _react.useCallback)(() => {
    if (autoScroll && (data === null || data === void 0 ? void 0 : data.length) > 0 && (listData === null || listData === void 0 ? void 0 : listData.length) === (data === null || data === void 0 ? void 0 : data.length)) {
      setTimeout(() => {
        if (refList && refList !== null && refList !== void 0 && refList.current) {
          const defaultValue = typeof value === 'object' ? (0, _get3.default)(value, valueField) : value;
          const index = (0, _findIndex2.default)(listData, e => (0, _isEqual2.default)(defaultValue, (0, _get3.default)(e, valueField)));
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
  const showOrClose = (0, _react.useCallback)(() => {
    if (!disable) {
      const visibleStatus = !visible;
      if (keyboardHeight > 0 && !visibleStatus) {
        return _reactNative.Keyboard.dismiss();
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
    const isSelected = currentValue && (0, _get3.default)(currentValue, valueField);
    return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableWithoutFeedback, {
      testID: testID,
      accessible: !!accessibilityLabel,
      accessibilityLabel: accessibilityLabel,
      onPress: showOrClose
    }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: _styles.styles.dropdown
    }, renderLeftIcon === null || renderLeftIcon === void 0 ? void 0 : renderLeftIcon(visible), /*#__PURE__*/_react.default.createElement(_reactNative.Text, _extends({
      style: [_styles.styles.textItem, isSelected !== null ? selectedTextStyle : placeholderStyle, font()]
    }, selectedTextProps), isSelected !== null ? (0, _get3.default)(currentValue, labelField) : placeholder), renderRightIcon ? renderRightIcon(visible) : /*#__PURE__*/_react.default.createElement(_reactNative.Image, {
      source: ic_down,
      style: _reactNative.StyleSheet.flatten([_styles.styles.icon, {
        tintColor: iconColor
      }, iconStyle])
    })));
  };
  const _renderItem = (0, _react.useCallback)(_ref => {
    let {
      item,
      index
    } = _ref;
    const isSelected = currentValue && (0, _get3.default)(currentValue, valueField);
    const selected = (0, _isEqual2.default)((0, _get3.default)(item, valueField), isSelected);
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
        backgroundColor: activeColor
      }])
    }, renderItem ? renderItem(item, selected) : /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: _styles.styles.item
    }, /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: _reactNative.StyleSheet.flatten([_styles.styles.textItem, itemTextStyle, font()])
    }, (0, _get3.default)(item, labelField)))));
  }, [accessibilityLabel, activeColor, currentValue, font, itemAccessibilityLabelField, itemContainerStyle, itemTestIDField, itemTextStyle, labelField, onSelect, renderItem, valueField]);
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
  const _renderList = (0, _react.useCallback)(isTopPosition => {
    const isInverted = !inverted ? false : isTopPosition;
    const _renderListHelper = () => {
      return /*#__PURE__*/_react.default.createElement(_reactNative.FlatList, _extends({
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
    return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableWithoutFeedback, null, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: _styles.styles.flexShrink
    }, isInverted && _renderListHelper(), renderSearch(), !isInverted && _renderListHelper()));
  }, [_renderItem, accessibilityLabel, flatListProps, listData, inverted, renderSearch, scrollIndex, showsVerticalScrollIndicator, testID]);
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
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: _reactNative.StyleSheet.flatten([_styles.styles.mainWrap, style]),
    ref: ref,
    onLayout: _measure
  }, _renderDropdown(), _renderModal());
});
var _default = DropdownComponent;
exports.default = _default;
//# sourceMappingURL=index.js.map