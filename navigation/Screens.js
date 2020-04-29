import React, {useEffect, useState} from 'react';
import {Dimensions} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import MessagesScreen from '../screens/MessageScreen';
import AccountScreen from '../screens/AccountScreen';

import {StateProvider, firebase, StateContext} from '../context';

const {width} = Dimensions.get('screen');
const profile = {
  avatar: Images.Profile,
  name: 'Guest',
  // type: "Seller",
  plan: 'VIP',
  rating: 4.8,
  isAnonymous: true,
};

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

export default (MainStack = props => {
  const [user, setUser] = useState(profile);

  return (
    <StateProvider user={user}>
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Tin nhan" component={MessagesScreen} />
        <Tab.Screen name="Tài khoản" component={AccountScreen} />
      </Tab.Navigator>
    </StateProvider>
  );
});
