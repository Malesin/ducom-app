"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styles = void 0;
var _reactNative = require("react-native");
const styles = _reactNative.StyleSheet.create({
  dropdown: {
    width: 58,
    paddingHorizontal: 6,
    height: 26
  },
  container: {
    width: 60
  },
  item: {
    flexDirection: _reactNative.I18nManager.isRTL ? 'row-reverse' : 'row',
    padding: 6,
    alignItems: 'center'
  },
  image: {
    width: 20,
    height: 20,
    marginRight: 3,
    marginVertical: 4
  },
  selectedTextStyle: {
    flex: 1,
    fontSize: 12,
    writingDirection: _reactNative.I18nManager.isRTL ? 'rtl' : 'ltr'
  }
});
exports.styles = styles;
//# sourceMappingURL=styles.js.map