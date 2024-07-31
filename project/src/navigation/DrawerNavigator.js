import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Homescreen, FAQscreen, Marksscreen, Settingsscreen } from '../pages';
import BottomTabNavigator from './BottomTabNavigator';


const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="HomeDrawer" component={Homescreen} />
            <Drawer.Screen name="FAQ" component={FAQscreen} />
            <Drawer.Screen name="Bookmarks" component={Marksscreen} />
            <Drawer.Screen name="Settings" component={Settingsscreen} />
        </Drawer.Navigator>
    );
}

export default DrawerNavigator;