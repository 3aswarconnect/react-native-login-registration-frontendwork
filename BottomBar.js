import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import UploadScreen from './UploadScreen';
const Tab = createBottomTabNavigator();
import ReelsScreen from './ReelsScreen';
import MemesScreen from './MemesScreen';
import ProfileScreen from './ProfileScreen';


const BottomBar = ({ route }) => {
    const userId = route?.params?.userId
    const username=route?.params?.username
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Reels" 
        component={ReelsScreen} 
        initialParams={{ userId }}
        options={{ tabBarIcon: ({ color }) => <Icon name="movie" color={color} size={24} /> }}
      />
      <Tab.Screen 
        name="Memes" 
        component={MemesScreen} 
        initialParams={{ userId }}
        options={{ tabBarIcon: ({ color }) => <Icon name="emoticon" color={color} size={24} /> }}
      />
      <Tab.Screen 
        name="Upload" 
        component={UploadScreen} 
        initialParams={{ userId, username }}  
        options={{ tabBarIcon: ({ color }) => <Icon name="cloud-upload" color={color} size={24} /> }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        initialParams={{ userId ,username}}
        options={{ tabBarIcon: ({ color }) => <Icon name="account" color={color} size={24} /> }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50, // Adjust this value if needed
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default BottomBar;
