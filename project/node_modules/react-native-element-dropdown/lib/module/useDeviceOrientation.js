/* eslint-disable @typescript-eslint/no-shadow */
import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
const isOrientationPortrait = _ref => {
  let {
    width,
    height
  } = _ref;
  return height >= width;
};
const isOrientationLandscape = _ref2 => {
  let {
    width,
    height
  } = _ref2;
  return width >= height;
};
export function useDeviceOrientation() {
  const screen = Dimensions.get('screen');
  const initialState = {
    portrait: isOrientationPortrait(screen),
    landscape: isOrientationLandscape(screen)
  };
  const [orientation, setOrientation] = useState(initialState);
  useEffect(() => {
    const onChange = _ref3 => {
      let {
        screen
      } = _ref3;
      setOrientation({
        portrait: isOrientationPortrait(screen),
        landscape: isOrientationLandscape(screen)
      });
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => {
      if (typeof (subscription === null || subscription === void 0 ? void 0 : subscription.remove) === 'function') {
        subscription.remove();
      }
    };
  }, []);
  return orientation.portrait ? 'PORTRAIT' : 'LANDSCAPE';
}
//# sourceMappingURL=useDeviceOrientation.js.map