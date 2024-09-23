import { StyleProp, ViewStyle } from 'react-native';
import type { DrawerProps } from '../types';
type Props = DrawerProps & {
    /**
     * Whether to use the legacy implementation of the drawer.
     * The legacy implementation uses v1 of Reanimated.
     * The modern implementation uses v2 of Reanimated.
     *
     * By default, the appropriate implementation is used based on whether Reanimated v2 is configured.
     */
    useLegacyImplementation?: boolean;
    /**
     * Style object for the wrapper view.
     */
    style?: StyleProp<ViewStyle>;
};
export declare function Drawer({ useLegacyImplementation, layout: customLayout, drawerType, drawerPosition, drawerStyle, swipeEnabled, swipeEdgeWidth, swipeMinDistance, swipeMinVelocity, keyboardDismissMode, hideStatusBarOnOpen, statusBarAnimation, style, ...rest }: Props): JSX.Element;
export {};
//# sourceMappingURL=Drawer.d.ts.map