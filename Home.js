import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const Home = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { email } = route.params || {}; // Get email from navigation params

  return (
    <View style={{ padding: 20 }}>
      <Text>Welcome, {email || 'Guest'}!</Text>
      <Button title="Logout" onPress={() => navigation.navigate('Auth')} />
    </View>
  );
};

export default Home;
