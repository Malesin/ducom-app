"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styles = void 0;
var _reactNative = require("react-native");
const styles = _reactNative.StyleSheet.create({
  mainWrap: {
    justifyContent: 'center'
  },
  container: {
    flexShrink: 1,
    borderWidth: 0.5,
    borderColor: '#EEEEEE',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2
  },
  flex1: {
    flex: 1
  },
  flexShrink: {
    flexShrink: 1
  },
  wrapTop: {
    justifyContent: 'flex-end'
  },
  dropdown: {
    flexDirection: _reactNative.I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    marginVertical: 5,
    fontSize: 16,
    writingDirection: _reactNative.I18nManager.isRTL ? 'rtl' : 'ltr'
  },
  item: {
    padding: 17,
    flexDirection: _reactNative.I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  textItem: {
    flex: 1,
    fontSize: 16,
    writingDirection: _reactNative.I18nManager.isRTL ? 'rtl' : 'ltr'
  },
  icon: {
    width: 20,
    height: 20
  },
  input: {
    borderWidth: 0.5,
    borderColor: '#DDDDDD',
    paddingHorizontal: 8,
    marginBottom: 8,
    margin: 6,
    height: 45
  },
  fullScreen: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
exports.styles = styles;
//# sourceMappingURL=styles.js.map