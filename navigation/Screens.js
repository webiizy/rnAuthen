import React, {useEffect, useState, useContext} from 'react';
import {Dimensions} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import MessagesScreen from '../screens/MessageScreen';
import AccountScreen from '../screens/AccountScreen';

import SignInScreen from '../screens/register/SignIn';
import SignUpScreen from '../screens/register/SignUp';

import {StateProvider, firebase, StateContext} from '../context';

const {width} = Dimensions.get('screen');
const profile = {
  avatar: '',
  name: 'Guest',
  // type: "Seller",
  plan: 'VIP',
  rating: 4.8,
  isAnonymous: true,
};

const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

function AcountStackScreen(props) {
  const {user} = useContext(StateContext);
  const {name} = props.route;
  return (
    <Stack.Navigator initialRouteName={name}>
      {user && user.isAnonymous ? (
        <Stack.Screen name="Sign In" component={SignInScreen} />
      ) : (
        <Stack.Screen name={name} component={AccountScreen} />
      )}
    </Stack.Navigator>
  );
}

function TabStack(props) {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tin nhan" component={MessagesScreen} />
      <Tab.Screen name="Tài khoản" component={AcountStackScreen} />
    </Tab.Navigator>
  );
}

export default (MainStack = props => {
  const [user, setUser] = useState({});
  global.currenRouter = 'Home';
  console.log('user---', user);

  useEffect(() => {
    firebase.onAuthStateChanged(setUser);
  }, []);

  return (
    <StateProvider user={user}>
      <Stack.Navigator>
        <Stack.Screen
          name="App"
          component={TabStack}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Sign Up" component={SignUpScreen} />
      </Stack.Navigator>
    </StateProvider>
  );
});
