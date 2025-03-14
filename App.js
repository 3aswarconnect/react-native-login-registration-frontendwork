import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthScreen from './AuthScreen';
import Home from './Home';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Auth" component={AuthScreen} options={{ title: 'Sign In / Register' }} />
        <Stack.Screen name="Homes" component={Home}  />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
