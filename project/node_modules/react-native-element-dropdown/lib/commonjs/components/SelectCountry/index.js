"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _Dropdown = _interopRequireDefault(require("../Dropdown"));
var _styles = require("./styles");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const SelectCountryComponent = /*#__PURE__*/_react.default.forwardRef((props, currentRef) => {
  const {
    data,
    value,
    valueField,
    labelField,
    imageField,
    selectedTextStyle,
    imageStyle
  } = props;
  const ref = (0, _react.useRef)(null);
  (0, _react.useImperativeHandle)(currentRef, () => {
    return {
      open: eventOpen,
      close: eventClose
    };
  });
  const eventOpen = () => {
    ref.current.open();
  };
  const eventClose = () => {
    ref.current.close();
  };
  const _renderItem = item => {
    return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
      style: _styles.styles.item
    }, /*#__PURE__*/_react.default.createElement(_reactNative.Image, {
      source: item[imageField],
      style: [_styles.styles.image, imageStyle]
    }), /*#__PURE__*/_react.default.createElement(_reactNative.Text, {
      style: [_styles.styles.selectedTextStyle, selectedTextStyle]
    }, item[labelField]));
  };
  const selectItem = (0, _react.useMemo)(() => {
    const index = data.findIndex(e => e[valueField] === value);
    return data[index];
  }, [data, valueField, value]);
  return /*#__PURE__*/_react.default.createElement(_Dropdown.default, _extends({
    ref: ref
  }, props, {
    renderItem: _renderItem,
    renderLeftIcon: () => {
      if (selectItem !== null && selectItem !== void 0 && selectItem.image) {
        return /*#__PURE__*/_react.default.createElement(_reactNative.Image, {
          source: selectItem.image,
          style: [_styles.styles.image, imageStyle]
        });
      } else {
        return null;
      }
    }
  }));
});
var _default = SelectCountryComponent;
exports.default = _default;
//# sourceMappingURL=index.js.map