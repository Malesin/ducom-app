"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styles = void 0;
var _reactNative = require("react-native");
const styles = _reactNative.StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center'
  },
  textInput: {
    flexDirection: _reactNative.I18nManager.isRTL ? 'row-reverse' : 'row',
    alignItems: 'center',
    flex: 1
  },
  input: {
    fontSize: 16,
    flex: 1,
    textAlign: _reactNative.I18nManager.isRTL ? 'right' : 'left'
  },
  label: {
    marginBottom: 4,
    fontSize: 16
  },
  row: {
    flexDirection: _reactNative.I18nManager.isRTL ? 'row-reverse' : 'row'
  },
  icon: {
    width: 20,
    height: 20
  }
});
exports.styles = styles;
//# sourceMappingURL=styles.js.map