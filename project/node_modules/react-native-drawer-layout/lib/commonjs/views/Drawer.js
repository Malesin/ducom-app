"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Drawer = Drawer;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var Reanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _constants = require("../constants");
var _GestureHandler = require("./GestureHandler");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const getDefaultDrawerWidth = _ref => {
  let {
    height,
    width
  } = _ref;
  /*
   * Default drawer width is screen width - header height
   * with a max width of 280 on mobile and 320 on tablet
   * https://material.io/components/navigation-drawer
   */
  const smallerAxisSize = Math.min(height, width);
  const isLandscape = width > height;
  const isTablet = smallerAxisSize >= 600;
  const appBarHeight = _reactNative.Platform.OS === 'ios' ? isLandscape ? 32 : 44 : 56;
  const maxWidth = isTablet ? 320 : 280;
  return Math.min(smallerAxisSize - appBarHeight, maxWidth);
};
function Drawer(_ref2) {
  var _Reanimated$isConfigu;
  let {
    // Reanimated 2 is not configured
    // @ts-expect-error: the type definitions are incomplete
    useLegacyImplementation = !((_Reanimated$isConfigu = Reanimated.isConfigured) !== null && _Reanimated$isConfigu !== void 0 && _Reanimated$isConfigu.call(Reanimated)),
    layout: customLayout,
    drawerType = _reactNative.Platform.select({
      ios: 'slide',
      default: 'front'
    }),
    drawerPosition = _reactNative.I18nManager.getConstants().isRTL ? 'right' : 'left',
    drawerStyle,
    swipeEnabled = _reactNative.Platform.OS !== 'web' && _reactNative.Platform.OS !== 'windows' && _reactNative.Platform.OS !== 'macos',
    swipeEdgeWidth = 32,
    swipeMinDistance = _constants.SWIPE_MIN_DISTANCE,
    swipeMinVelocity = _constants.SWIPE_MIN_VELOCITY,
    keyboardDismissMode = 'on-drag',
    hideStatusBarOnOpen = false,
    statusBarAnimation = 'slide',
    style,
    ...rest
  } = _ref2;
  // Reanimated v3 dropped legacy v1 API
  const legacyImplemenationNotAvailable = require('react-native-reanimated').abs === undefined;
  if (useLegacyImplementation && legacyImplemenationNotAvailable) {
    throw new Error('The `useLegacyImplementation` prop is not available with Reanimated 3 as it no longer includes support for Reanimated 1 legacy API. Remove the `useLegacyImplementation` prop from `Drawer.Navigator` to be able to use it.');
  }
  const Drawer = useLegacyImplementation ? require('./legacy/Drawer').Drawer : require('./modern/Drawer').Drawer;
  const windowDimensions = (0, _reactNative.useWindowDimensions)();
  const layout = customLayout ?? windowDimensions;
  return /*#__PURE__*/React.createElement(_GestureHandler.GestureHandlerRootView, {
    style: [styles.container, style]
  }, /*#__PURE__*/React.createElement(Drawer, _extends({}, rest, {
    layout: layout,
    drawerType: drawerType,
    drawerPosition: drawerPosition,
    drawerStyle: [{
      width: getDefaultDrawerWidth(layout)
    }, styles.drawer, drawerStyle],
    swipeEnabled: swipeEnabled,
    swipeEdgeWidth: swipeEdgeWidth,
    swipeMinDistance: swipeMinDistance,
    swipeMinVelocity: swipeMinVelocity,
    keyboardDismissMode: keyboardDismissMode,
    hideStatusBarOnOpen: hideStatusBarOnOpen,
    statusBarAnimation: statusBarAnimation
  })));
}
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1
  },
  drawer: {
    backgroundColor: 'white'
  }
});
//# sourceMappingURL=Drawer.js.map