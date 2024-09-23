import type { DrawerProps } from '../../types';
type Props = DrawerProps & {
    layout: {
        width: number;
    };
};
export declare function Drawer({ layout, drawerPosition, drawerStyle, drawerType, gestureHandlerProps, hideStatusBarOnOpen, keyboardDismissMode, onClose, onOpen, onGestureStart, onGestureCancel, onGestureEnd, onTransitionStart, onTransitionEnd, open, overlayStyle, overlayAccessibilityLabel, statusBarAnimation, swipeEnabled, swipeEdgeWidth, swipeMinDistance, swipeMinVelocity, renderDrawerContent, children, }: Props): JSX.Element;
export {};
//# sourceMappingURL=Drawer.d.ts.map