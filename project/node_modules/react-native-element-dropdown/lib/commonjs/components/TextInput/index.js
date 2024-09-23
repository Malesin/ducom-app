"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _styles = require("./styles");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const ic_close = require('../../assets/close.png');
const TextInputComponent = props => {
  const {
    fontFamily,
    style,
    value,
    placeholderTextColor = '#000',
    placeholder = '',
    showIcon,
    inputStyle,
    iconStyle,
    onChangeText = _value => {},
    renderLeftIcon,
    renderRightIcon
  } = props;
  const [text, setText] = (0, _react.useState)('');
  (0, _react.useEffect)(() => {
    if (value) {
      setText(value);
    }
  }, [value]);
  const onChange = text => {
    setText(text);
    onChangeText(text);
  };
  const _renderRightIcon = () => {
    if (showIcon) {
      if (renderRightIcon) {
        return renderRightIcon();
      }
      if (text.length > 0) {
        return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableOpacity, {
          onPress: () => onChange('')
        }, /*#__PURE__*/_react.default.createElement(_reactNative.Image, {
          source: ic_close,
          style: _reactNative.StyleSheet.flatten([_styles.styles.icon, iconStyle])
        }));
      }
      return null;
    }
    return null;
  };
  const font = () => {
    if (fontFamily) {
      return {
        fontFamily: fontFamily
      };
    } else {
      return {};
    }
  };
  return /*#__PURE__*/_react.default.createElement(_reactNative.TouchableWithoutFeedback, null, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: [style]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: _styles.styles.textInput
  }, renderLeftIcon === null || renderLeftIcon === void 0 ? void 0 : renderLeftIcon(), /*#__PURE__*/_react.default.createElement(_reactNative.TextInput, _extends({}, props, {
    style: _reactNative.StyleSheet.flatten([_styles.styles.input, inputStyle, font()]),
    value: text,
    placeholder: placeholder,
    placeholderTextColor: placeholderTextColor,
    onChangeText: onChange
  })), _renderRightIcon())));
};
var _default = TextInputComponent;
exports.default = _default;
//# sourceMappingURL=index.js.map