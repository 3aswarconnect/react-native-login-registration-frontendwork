import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://192.168.76.183:4000/signin', { email, password });
      Alert.alert(response.data.message);
    } catch (error) {
      Alert.alert('Error', error.response?.data.message || 'Something went wrong');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://192.168.76.183:4000/register', { email, password });
      Alert.alert(response.data.message);
    } catch (error) {
      Alert.alert('Error', error.response?.data.message || 'Something went wrong');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>{isRegister ? 'Register' : 'Sign In'}</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderBottomWidth: 1 }} />
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
