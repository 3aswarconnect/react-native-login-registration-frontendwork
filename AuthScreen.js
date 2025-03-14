import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import Home from './Home';
import { useNavigation } from '@react-navigation/native';
const AuthScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://192.168.76.183:4000/signin', { email, password });
      Alert.alert(response.data.message);
      navigation.navigate('Homes', { email ,username});
    } catch (error) {
      Alert.alert('Error', error.response?.data.message || 'Something went wrong');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://192.168.76.183:4000/register', { username,email, password });
      Alert.alert(response.data.message);
      navigation.navigate('Homes', { email ,username});
    } catch (error) {
      Alert.alert('Error', error.response?.data.message || 'Something went wrong');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>{isRegister ? 'Register' : 'Sign In'}</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderBottomWidth: 1 }} />
      <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={{ borderBottomWidth: 1, marginBottom: 10 }}
        />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderBottomWidth: 1, marginVertical: 10 }}
      />
      {isRegister ? (
        <>
          <Button title="Register" onPress={handleRegister} />
          <Button title="Already have an account? Sign In" onPress={() => setIsRegister(false)} />
        </>
      ) : (
        <>
          <Button title="Sign In" onPress={handleSignIn} />
          <Button title="New User? Register" onPress={() => setIsRegister(true)} />
        </>
      )}
    </View>
  );
};

export default AuthScreen;
