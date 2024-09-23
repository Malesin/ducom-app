"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Drawer = void 0;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireDefault(require("react-native-reanimated"));
var _constants = require("../../constants");
var _DrawerProgressContext = require("../../utils/DrawerProgressContext");
var _GestureHandler = require("../GestureHandler");
var _Overlay = require("./Overlay");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const {
  Clock,
  Value,
  onChange,
  clockRunning,
  startClock,
  stopClock,
  spring,
  abs,
  add,
  and,
  block,
  call,
  cond,
  divide,
  eq,
  event,
  greaterThan,
  lessThan,
  max,
  min,
  multiply,
  neq,
  or,
  set,
  sub
} = _reactNativeReanimated.default;
const TRUE = 1;
const FALSE = 0;
const NOOP = 0;
const UNSET = -1;
const DIRECTION_LEFT = 1;
const DIRECTION_RIGHT = -1;
const SPRING_CONFIG = {
  stiffness: 1000,
  damping: 500,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01
};
const ANIMATED_ZERO = new _reactNativeReanimated.default.Value(0);
const ANIMATED_ONE = new _reactNativeReanimated.default.Value(1);
class Drawer extends React.Component {
  componentDidUpdate(prevProps) {
    const {
      open,
      drawerPosition,
      drawerType,
      swipeMinDistance,
      swipeMinVelocity,
      hideStatusBarOnOpen
    } = this.props;
    if (
    // If we're not in the middle of a transition, sync the drawer's open state
    typeof this.pendingOpenValue !== 'boolean' || open !== this.pendingOpenValue) {
      this.toggleDrawer(open);
    }
    this.pendingOpenValue = undefined;
    if (open !== prevProps.open && hideStatusBarOnOpen) {
      this.toggleStatusBar(open);
    }
    if (prevProps.drawerPosition !== drawerPosition) {
      this.drawerPosition.setValue(drawerPosition === 'right' ? DIRECTION_RIGHT : DIRECTION_LEFT);
    }
    if (prevProps.drawerType !== drawerType) {
      this.isDrawerTypeFront.setValue(drawerType === 'front' ? TRUE : FALSE);
    }
    if (prevProps.swipeMinDistance !== swipeMinDistance) {
      this.swipeDistanceThreshold.setValue(swipeMinDistance ?? _constants.SWIPE_MIN_DISTANCE);
    }
    if (prevProps.swipeMinVelocity !== swipeMinVelocity) {
      this.swipeVelocityThreshold.setValue(swipeMinVelocity ?? _constants.SWIPE_MIN_VELOCITY);
    }
  }
  componentWillUnmount() {
    this.toggleStatusBar(false);
    this.handleEndInteraction();
  }
  handleEndInteraction = () => {
    if (this.interactionHandle !== undefined) {
      _reactNative.InteractionManager.clearInteractionHandle(this.interactionHandle);
      this.interactionHandle = undefined;
    }
  };
  handleStartInteraction = () => {
    if (this.interactionHandle === undefined) {
      this.interactionHandle = _reactNative.InteractionManager.createInteractionHandle();
    }
  };
  getDrawerWidth = () => {
    const {
      drawerStyle,
      layout
    } = this.props;
    const {
      width = _constants.DEFAULT_DRAWER_WIDTH
    } = _reactNative.StyleSheet.flatten(drawerStyle) || {};
    if (typeof width === 'string' && width.endsWith('%')) {
      // Try to calculate width if a percentage is given
      const percentage = Number(width.replace(/%$/, ''));
      if (Number.isFinite(percentage)) {
        return layout.width * (percentage / 100);
      }
    }
    return typeof width === 'number' ? width : 0;
  };
  clock = new Clock();
  isDrawerTypeFront = new Value(this.props.drawerType === 'front' ? TRUE : FALSE);
  isOpen = new Value(this.props.open ? TRUE : FALSE);
  nextIsOpen = new Value(UNSET);
  isSwiping = new Value(FALSE);
  initialDrawerWidth = this.getDrawerWidth();
  gestureState = new Value(_GestureHandler.GestureState.UNDETERMINED);
  touchX = new Value(0);
  velocityX = new Value(0);
  gestureX = new Value(0);
  offsetX = new Value(0);
  position = new Value(this.props.open ? this.initialDrawerWidth * (this.props.drawerPosition === 'right' ? DIRECTION_RIGHT : DIRECTION_LEFT) : 0);
  containerWidth = new Value(this.props.layout.width);
  drawerWidth = new Value(this.initialDrawerWidth);
  drawerOpacity = new Value(this.props.drawerType === 'permanent' ? 1 : 0);
  drawerPosition = new Value(this.props.drawerPosition === 'right' ? DIRECTION_RIGHT : DIRECTION_LEFT);

  // Comment stolen from react-native-gesture-handler/DrawerLayout
  //
  // While closing the drawer when user starts gesture outside of its area (in greyed
  // out part of the window), we want the drawer to follow only once finger reaches the
  // edge of the drawer.
  // E.g. on the diagram below drawer is illustrate by X signs and the greyed out area by
  // dots. The touch gesture starts at '*' and moves left, touch path is indicated by
  // an arrow pointing left
  // 1) +---------------+ 2) +---------------+ 3) +---------------+ 4) +---------------+
  //    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
  //    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
  //    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
  //    |XXXXXXXX|......|    |XXXXXXXX|.<-*..|    |XXXXXXXX|<--*..|    |XXXXX|<-----*..|
  //    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
  //    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
  //    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXXXXX|......|    |XXXXX|.........|
  //    +---------------+    +---------------+    +---------------+    +---------------+
  //
  // For the above to work properly we define animated value that will keep start position
  // of the gesture. Then we use that value to calculate how much we need to subtract from
  // the dragX. If the gesture started on the greyed out area we take the distance from the
  // edge of the drawer to the start position. Otherwise we don't subtract at all and the
  // drawer be pulled back as soon as you start the pan.
  //
  // This is used only when drawerType is "front"
  touchDistanceFromDrawer = cond(this.isDrawerTypeFront, cond(eq(this.drawerPosition, DIRECTION_LEFT), max(
  // Distance of touch start from left screen edge - Drawer width
  sub(sub(this.touchX, this.gestureX), this.drawerWidth), 0), min(multiply(
  // Distance of drawer from left screen edge - Touch start point
  sub(sub(this.containerWidth, this.drawerWidth), sub(this.touchX, this.gestureX)), DIRECTION_RIGHT), 0)), 0);
  swipeDistanceThreshold = new Value(this.props.swipeMinDistance ?? _constants.SWIPE_MIN_DISTANCE);
  swipeVelocityThreshold = new Value(this.props.swipeMinVelocity ?? _constants.SWIPE_MIN_VELOCITY);
  currentOpenValue = this.props.open;
  isStatusBarHidden = false;
  manuallyTriggerSpring = new Value(FALSE);
  transitionTo = isOpen => {
    const toValue = new Value(0);
    const frameTime = new Value(0);
    const state = {
      position: this.position,
      time: new Value(0),
      finished: new Value(FALSE),
      velocity: new Value(0)
    };
    return block([cond(clockRunning(this.clock), NOOP, [
    // Animation wasn't running before
    // Set the initial values and start the clock
    set(toValue, multiply(isOpen, this.drawerWidth, this.drawerPosition)), set(frameTime, 0), set(state.time, 0), set(state.finished, FALSE), set(state.velocity, this.velocityX), set(this.isOpen, isOpen), startClock(this.clock), call([], this.handleStartInteraction), set(this.manuallyTriggerSpring, FALSE)]), spring(this.clock, state, {
      ...SPRING_CONFIG,
      toValue
    }), onChange(state.finished, cond(state.finished, call([this.isOpen], open => {
      var _this$props$onTransit, _this$props;
      return (_this$props$onTransit = (_this$props = this.props).onTransitionEnd) === null || _this$props$onTransit === void 0 ? void 0 : _this$props$onTransit.call(_this$props, !open);
    }), call([this.isOpen], open => {
      var _this$props$onTransit2, _this$props2;
      return (_this$props$onTransit2 = (_this$props2 = this.props).onTransitionStart) === null || _this$props$onTransit2 === void 0 ? void 0 : _this$props$onTransit2.call(_this$props2, !open);
    }))), cond(state.finished, [
    // Reset gesture and velocity from previous gesture
    set(this.touchX, 0), set(this.gestureX, 0), set(this.velocityX, 0), set(this.offsetX, 0),
    // When the animation finishes, stop the clock
    stopClock(this.clock), call([this.isOpen], _ref => {
      let [value] = _ref;
      const open = Boolean(value);
      this.handleEndInteraction();
      if (open !== this.props.open) {
        // Sync drawer's state after animation finished
        // This shouldn't be necessary, but there seems to be an issue on iOS
        this.toggleDrawer(this.props.open);
      }
    })])]);
  };
  dragX = block([onChange(this.isOpen, call([this.isOpen], _ref2 => {
    let [value] = _ref2;
    const open = Boolean(value);
    this.currentOpenValue = open;

    // Without this check, the drawer can go to an infinite update <-> animate loop for sync updates
    if (open !== this.props.open) {
      // If the mode changed, update state
      if (open) {
        this.props.onOpen();
      } else {
        this.props.onClose();
      }
      this.pendingOpenValue = open;

      // Force componentDidUpdate to fire, whether user does a setState or not
      // This allows us to detect when the user drops the update and revert back
      // It's necessary to make sure that the state stays in sync
      this.forceUpdate();
    }
  })), onChange(this.nextIsOpen, cond(neq(this.nextIsOpen, UNSET), [
  // Stop any running animations
  cond(clockRunning(this.clock), stopClock(this.clock)),
  // Update the open value to trigger the transition
  set(this.isOpen, this.nextIsOpen), set(this.gestureX, 0), set(this.nextIsOpen, UNSET)])),
  // This block must be after the this.isOpen listener since we check for current value
  onChange(this.isSwiping,
  // Listen to updates for this value only when it changes
  // Without `onChange`, this will fire even if the value didn't change
  // We don't want to call the listeners if the value didn't change
  call([this.isSwiping], _ref3 => {
    let [value] = _ref3;
    const {
      keyboardDismissMode
    } = this.props;
    if (value === TRUE) {
      if (keyboardDismissMode === 'on-drag') {
        _reactNative.Keyboard.dismiss();
      }
      this.toggleStatusBar(true);
    } else {
      this.toggleStatusBar(this.currentOpenValue);
    }
  })), onChange(this.gestureState, cond(eq(this.gestureState, _GestureHandler.GestureState.ACTIVE), call([], this.handleStartInteraction))), onChange(this.gestureState, cond(eq(this.gestureState, _GestureHandler.GestureState.END), [call([], () => {
    var _this$props$onGesture, _this$props3;
    return (_this$props$onGesture = (_this$props3 = this.props).onGestureEnd) === null || _this$props$onGesture === void 0 ? void 0 : _this$props$onGesture.call(_this$props3);
  })])), onChange(this.gestureState, cond(eq(this.gestureState, _GestureHandler.GestureState.CANCELLED), [call([], () => {
    var _this$props$onGesture2, _this$props4;
    return (_this$props$onGesture2 = (_this$props4 = this.props).onGestureCancel) === null || _this$props$onGesture2 === void 0 ? void 0 : _this$props$onGesture2.call(_this$props4);
  })])), cond(eq(this.gestureState, _GestureHandler.GestureState.ACTIVE), [cond(this.isSwiping, NOOP, [
  // We weren't dragging before, set it to true
  set(this.isSwiping, TRUE),
  // Also update the drag offset to the last position
  set(this.offsetX, this.position), call([], () => {
    var _this$props$onGesture3, _this$props5;
    return (_this$props$onGesture3 = (_this$props5 = this.props).onGestureStart) === null || _this$props$onGesture3 === void 0 ? void 0 : _this$props$onGesture3.call(_this$props5);
  })]),
  // Update position with previous offset + gesture distance
  set(this.position, add(this.offsetX, this.gestureX, this.touchDistanceFromDrawer)),
  // Stop animations while we're dragging
  stopClock(this.clock)], [set(this.isSwiping, FALSE), set(this.touchX, 0), this.transitionTo(cond(this.manuallyTriggerSpring, this.isOpen, cond(or(and(greaterThan(abs(this.gestureX), _constants.SWIPE_MIN_OFFSET), greaterThan(abs(this.velocityX), this.swipeVelocityThreshold)), greaterThan(abs(this.gestureX), this.swipeDistanceThreshold)), cond(eq(this.drawerPosition, DIRECTION_LEFT),
  // If swiped to right, open the drawer, otherwise close it
  greaterThan(cond(eq(this.velocityX, 0), this.gestureX, this.velocityX), 0),
  // If swiped to left, open the drawer, otherwise close it
  lessThan(cond(eq(this.velocityX, 0), this.gestureX, this.velocityX), 0)), this.isOpen)))]), this.position]);
  translateX = cond(eq(this.drawerPosition, DIRECTION_RIGHT), min(max(multiply(this.drawerWidth, -1), this.dragX), 0), max(min(this.drawerWidth, this.dragX), 0));
  progress = cond(
  // Check if the drawer width is available to avoid division by zero
  eq(this.drawerWidth, 0), 0, abs(divide(this.translateX, this.drawerWidth)));
  handleGestureEvent = event([{
    nativeEvent: {
      x: this.touchX,
      translationX: this.gestureX,
      velocityX: this.velocityX
    }
  }]);
  handleGestureStateChange = event([{
    nativeEvent: {
      state: s => set(this.gestureState, s)
    }
  }]);
  handleContainerLayout = e => this.containerWidth.setValue(e.nativeEvent.layout.width);
  handleDrawerLayout = e => {
    this.drawerWidth.setValue(e.nativeEvent.layout.width);
    this.toggleDrawer(this.props.open);

    // Until layout is available, drawer is hidden with opacity: 0 by default
    // Show it in the next frame when layout is available
    // If we don't delay it until the next frame, there's a visible flicker
    requestAnimationFrame(() => requestAnimationFrame(() => this.drawerOpacity.setValue(1)));
  };
  toggleDrawer = open => {
    if (this.currentOpenValue !== open) {
      this.nextIsOpen.setValue(open ? TRUE : FALSE);

      // This value will also be set shortly after as changing this.nextIsOpen changes this.isOpen
      // However, there's a race condition on Android, so we need to set a bit earlier
      this.currentOpenValue = open;
    }
  };
  toggleStatusBar = hidden => {
    const {
      hideStatusBarOnOpen: hideStatusBar,
      statusBarAnimation
    } = this.props;
    if (hideStatusBar && this.isStatusBarHidden !== hidden) {
      this.isStatusBarHidden = hidden;
      _reactNative.StatusBar.setHidden(hidden, statusBarAnimation);
    }
  };
  render() {
    const {
      open,
      swipeEnabled,
      drawerPosition,
      drawerType,
      swipeEdgeWidth,
      drawerStyle,
      overlayStyle,
      renderDrawerContent,
      children,
      gestureHandlerProps,
      overlayAccessibilityLabel
    } = this.props;
    const isOpen = drawerType === 'permanent' ? true : open;
    const isRight = drawerPosition === 'right';
    const contentTranslateX = drawerType === 'front' ? ANIMATED_ZERO : this.translateX;
    const drawerTranslateX = drawerType === 'back' ? _reactNative.I18nManager.getConstants().isRTL ? multiply(sub(this.containerWidth, this.drawerWidth), isRight ? 1 : -1) : ANIMATED_ZERO : this.translateX;
    const offset = drawerType === 'back' ? 0 : _reactNative.I18nManager.getConstants().isRTL ? '100%' : multiply(this.drawerWidth, -1);

    // FIXME: Currently hitSlop is broken when on Android when drawer is on right
    // https://github.com/software-mansion/react-native-gesture-handler/issues/569
    const hitSlop = isRight ?
    // Extend hitSlop to the side of the screen when drawer is closed
    // This lets the user drag the drawer from the side of the screen
    {
      right: 0,
      width: isOpen ? undefined : swipeEdgeWidth
    } : {
      left: 0,
      width: isOpen ? undefined : swipeEdgeWidth
    };
    const progress = drawerType === 'permanent' ? ANIMATED_ONE : this.progress;
    return /*#__PURE__*/React.createElement(_DrawerProgressContext.DrawerProgressContext.Provider, {
      value: progress
    }, /*#__PURE__*/React.createElement(_GestureHandler.PanGestureHandler, _extends({
      activeOffsetX: [-_constants.SWIPE_MIN_OFFSET, _constants.SWIPE_MIN_OFFSET],
      failOffsetY: [-_constants.SWIPE_MIN_OFFSET, _constants.SWIPE_MIN_OFFSET],
      onGestureEvent: this.handleGestureEvent,
      onHandlerStateChange: this.handleGestureStateChange,
      hitSlop: hitSlop,
      enabled: drawerType !== 'permanent' && swipeEnabled
    }, gestureHandlerProps), /*#__PURE__*/React.createElement(_reactNativeReanimated.default.View, {
      onLayout: this.handleContainerLayout,
      style: [styles.main, {
        flexDirection: drawerType === 'permanent' && !isRight ? 'row-reverse' : 'row'
      }]
    }, /*#__PURE__*/React.createElement(_reactNativeReanimated.default.View, {
      style: [styles.content, {
        transform: drawerType === 'permanent' ?
        // Reanimated needs the property to be present, but it results in Browser bug
        // https://bugs.chromium.org/p/chromium/issues/detail?id=20574
        [] : [{
          translateX: contentTranslateX
        }]
      }]
    }, /*#__PURE__*/React.createElement(_reactNative.View, {
      accessibilityElementsHidden: isOpen && drawerType !== 'permanent',
      importantForAccessibility: isOpen && drawerType !== 'permanent' ? 'no-hide-descendants' : 'auto',
      style: styles.content
    }, children),
    // Disable overlay if sidebar is permanent
    drawerType === 'permanent' ? null : /*#__PURE__*/React.createElement(_Overlay.Overlay, {
      progress: progress,
      onPress: () => this.toggleDrawer(false),
      accessibilityLabel: overlayAccessibilityLabel,
      style: overlayStyle,
      accessibilityElementsHidden: !isOpen,
      importantForAccessibility: isOpen ? 'auto' : 'no-hide-descendants'
    })), /*#__PURE__*/React.createElement(_reactNativeReanimated.default.Code, {
      // This is needed to make sure that container width updates with `setValue`
      // Without this, it won't update when not used in styles
      exec: this.containerWidth
    }), drawerType === 'permanent' ? null : /*#__PURE__*/React.createElement(_reactNativeReanimated.default.Code, {
      exec: block([onChange(this.manuallyTriggerSpring, [cond(eq(this.manuallyTriggerSpring, TRUE), [set(this.nextIsOpen, FALSE), call([], () => this.currentOpenValue = false)])])])
    }), /*#__PURE__*/React.createElement(_reactNativeReanimated.default.View, {
      removeClippedSubviews: _reactNative.Platform.OS !== 'ios',
      onLayout: this.handleDrawerLayout,
      style: [styles.container, {
        transform: drawerType === 'permanent' ?
        // Reanimated needs the property to be present, but it results in Browser bug
        // https://bugs.chromium.org/p/chromium/issues/detail?id=20574
        [] : [{
          translateX: drawerTranslateX
        }],
        opacity: this.drawerOpacity
      }, drawerType === 'permanent' ?
      // Without this, the `left`/`right` values don't get reset
      isRight ? {
        right: 0
      } : {
        left: 0
      } : [styles.nonPermanent, isRight ? {
        right: offset
      } : {
        left: offset
      }, {
        zIndex: drawerType === 'back' ? -1 : 0
      }], drawerStyle]
    }, renderDrawerContent()))));
  }
}
exports.Drawer = Drawer;
const styles = _reactNative.StyleSheet.create({
  container: {
    backgroundColor: 'white',
    maxWidth: '100%'
  },
  nonPermanent: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: _constants.DEFAULT_DRAWER_WIDTH
  },
  content: {
    flex: 1
  },
  main: {
    flex: 1,
    ..._reactNative.Platform.select({
      // FIXME: We need to hide `overflowX` on Web so the translated content doesn't show offscreen.
      // But adding `overflowX: 'hidden'` prevents content from collapsing the URL bar.
      web: null,
      default: {
        overflow: 'hidden'
      }
    })
  }
});
//# sourceMappingURL=Drawer.js.map