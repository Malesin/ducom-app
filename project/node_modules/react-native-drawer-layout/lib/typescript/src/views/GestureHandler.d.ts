import * as React from 'react';
import { View } from 'react-native';
export declare const PanGestureHandler: React.ComponentType<import("react-native-gesture-handler").PanGestureHandlerProps>;
export declare const TapGestureHandler: React.ComponentType<import("react-native-gesture-handler").TapGestureHandlerProps>;
export declare const GestureHandlerRootView: typeof View;
export declare const enum GestureState {
    UNDETERMINED = 0,
    FAILED = 1,
    BEGAN = 2,
    CANCELLED = 3,
    ACTIVE = 4,
    END = 5
}
export type { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
//# sourceMappingURL=GestureHandler.d.ts.map