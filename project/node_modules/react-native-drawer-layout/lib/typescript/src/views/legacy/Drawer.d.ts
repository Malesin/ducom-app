import * as React from 'react';
import type { DrawerProps } from '../../types';
type Props = DrawerProps & {
    layout: {
        width: number;
    };
};
export declare class Drawer extends React.Component<Props> {
    componentDidUpdate(prevProps: Props): void;
    componentWillUnmount(): void;
    private handleEndInteraction;
    private handleStartInteraction;
    private getDrawerWidth;
    private clock;
    private interactionHandle;
    private isDrawerTypeFront;
    private isOpen;
    private nextIsOpen;
    private isSwiping;
    private initialDrawerWidth;
    private gestureState;
    private touchX;
    private velocityX;
    private gestureX;
    private offsetX;
    private position;
    private containerWidth;
    private drawerWidth;
    private drawerOpacity;
    private drawerPosition;
    private touchDistanceFromDrawer;
    private swipeDistanceThreshold;
    private swipeVelocityThreshold;
    private currentOpenValue;
    private pendingOpenValue;
    private isStatusBarHidden;
    private manuallyTriggerSpring;
    private transitionTo;
    private dragX;
    private translateX;
    private progress;
    private handleGestureEvent;
    private handleGestureStateChange;
    private handleContainerLayout;
    private handleDrawerLayout;
    private toggleDrawer;
    private toggleStatusBar;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=Drawer.d.ts.map