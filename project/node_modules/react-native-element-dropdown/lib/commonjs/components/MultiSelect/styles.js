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
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: '#EEEEEE',
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
  dropdownInside: {
    flexDirection: _reactNative.I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 35
  },
  title: {
    marginVertical: 5,
    fontSize: 16,
    writingDirection: _reactNative.I18nManager.isRTL ? 'rtl' : 'ltr'
  },
  wrapItem: {
    marginBottom: 0.5
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
  rowSelectedItem: {
    flexDirection: _reactNative.I18nManager.isRTL ? 'row-reverse' : 'row',
    flexWrap: 'wrap'
  },
  selectedItem: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: 'gray',
    paddingHorizontal: 8,
    marginVertical: 6,
    marginRight: 8,
    flexDirection: _reactNative.I18nManager.isRTL ? 'row-reverse' : 'row'
  },
  selectedTextItem: {
    marginLeft: 5,
    color: 'gray',
    fontSize: 16,
    writingDirection: _reactNative.I18nManager.isRTL ? 'rtl' : 'ltr'
  },
  selectedTextLeftItem: {
    fontSize: 12,
    color: 'gray',
    writingDirection: _reactNative.I18nManager.isRTL ? 'rtl' : 'ltr'
  },
  fullScreen: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
exports.styles = styles;
//# sourceMappingURL=styles.js.map