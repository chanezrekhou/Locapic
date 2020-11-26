console.disableYellowBox = true;

import React from 'react';
import MapScreen from './screens/MapScreen';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import PoiScreen from './screens/PoiScreen';

import {createAppContainer } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import { FontAwesome } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import pseudo from './reducers/pseudo';
import mySpots from './reducers/mySpots';

const store = createStore(combineReducers({pseudo, mySpots}));

var BottomNavigator = createBottomTabNavigator({
  Map: MapScreen,
  Chat: ChatScreen,
  MySpots: PoiScreen,
},
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }) => {
        var iconName;
        if (navigation.state.routeName == 'Map') {
          iconName = 'ios-navigate';
        } else if (navigation.state.routeName == 'Chat') {
          iconName = 'ios-chatboxes';
        } else if (navigation.state.routeName == 'MySpots') {
          iconName = 'ios-pin'
        }

        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#eb4d4b',
      inactiveTintColor: '#FFFFFF',
      style: {
        backgroundColor: '#130f40',
      }
    }
   

  });

StackNavigator = createStackNavigator({ 
  Home:  HomeScreen,  
  BottomNavigator: BottomNavigator
}, 
{headerMode: 'none'}
);   

const Navigation = createAppContainer(StackNavigator);

export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
 }
