"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDrawerProgress = useDrawerProgress;
var React = _interopRequireWildcard(require("react"));
var _DrawerProgressContext = require("./DrawerProgressContext");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function useDrawerProgress() {
  const progress = React.useContext(_DrawerProgressContext.DrawerProgressContext);
  if (progress === undefined) {
    throw new Error("Couldn't find a drawer. Is your component inside a drawer?");
  }
  return progress;
}
//# sourceMappingURL=useDrawerProgress.js.map