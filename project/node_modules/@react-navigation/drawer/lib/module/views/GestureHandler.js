import * as React from 'react';
import { View } from 'react-native';
const Dummy = _ref => {
  let {
    children
  } = _ref;
  return /*#__PURE__*/React.createElement(React.Fragment, null, children);
};
export const PanGestureHandler = Dummy;
export const TapGestureHandler = Dummy;
export const GestureHandlerRootView = View;
export let GestureState;
(function (GestureState) {
  GestureState[GestureState["UNDETERMINED"] = 0] = "UNDETERMINED";
  GestureState[GestureState["FAILED"] = 1] = "FAILED";
  GestureState[GestureState["BEGAN"] = 2] = "BEGAN";
  GestureState[GestureState["CANCELLED"] = 3] = "CANCELLED";
  GestureState[GestureState["ACTIVE"] = 4] = "ACTIVE";
  GestureState[GestureState["END"] = 5] = "END";
})(GestureState || (GestureState = {}));
//# sourceMappingURL=GestureHandler.js.map