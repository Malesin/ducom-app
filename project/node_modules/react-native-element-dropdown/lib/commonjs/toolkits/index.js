"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDetectDevice = void 0;
var _reactNative = require("react-native");
const {
  width,
  height
} = _reactNative.Dimensions.get('window');
const isTablet = () => {
  let pixelDensity = _reactNative.PixelRatio.get();
  const adjustedWidth = width * pixelDensity;
  const adjustedHeight = height * pixelDensity;
  if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return true;
  } else {
    return pixelDensity === 2 && (adjustedWidth >= 1824 || adjustedHeight >= 1824);
  }
};
const useDetectDevice = {
  isAndroid: _reactNative.Platform.OS === 'android',
  isIOS: _reactNative.Platform.OS === 'ios',
  isTablet: isTablet()
};
exports.useDetectDevice = useDetectDevice;
//# sourceMappingURL=index.js.map