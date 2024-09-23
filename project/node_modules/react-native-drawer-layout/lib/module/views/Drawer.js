function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import * as React from 'react';
import { I18nManager, Platform, StyleSheet, useWindowDimensions } from 'react-native';
import * as Reanimated from 'react-native-reanimated';
import { SWIPE_MIN_DISTANCE, SWIPE_MIN_VELOCITY } from '../constants';
import { GestureHandlerRootView } from './GestureHandler';
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
  const appBarHeight = Platform.OS === 'ios' ? isLandscape ? 32 : 44 : 56;
  const maxWidth = isTablet ? 320 : 280;
  return Math.min(smallerAxisSize - appBarHeight, maxWidth);
};
export function Drawer(_ref2) {
  var _Reanimated$isConfigu;
  let {
    // Reanimated 2 is not configured
    // @ts-expect-error: the type definitions are incomplete
    useLegacyImplementation = !((_Reanimated$isConfigu = Reanimated.isConfigured) !== null && _Reanimated$isConfigu !== void 0 && _Reanimated$isConfigu.call(Reanimated)),
    layout: customLayout,
    drawerType = Platform.select({
      ios: 'slide',
      default: 'front'
    }),
    drawerPosition = I18nManager.getConstants().isRTL ? 'right' : 'left',
    drawerStyle,
    swipeEnabled = Platform.OS !== 'web' && Platform.OS !== 'windows' && Platform.OS !== 'macos',
    swipeEdgeWidth = 32,
    swipeMinDistance = SWIPE_MIN_DISTANCE,
    swipeMinVelocity = SWIPE_MIN_VELOCITY,
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
  const windowDimensions = useWindowDimensions();
  const layout = customLayout ?? windowDimensions;
  return /*#__PURE__*/React.createElement(GestureHandlerRootView, {
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
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  drawer: {
    backgroundColor: 'white'
  }
});
//# sourceMappingURL=Drawer.js.map