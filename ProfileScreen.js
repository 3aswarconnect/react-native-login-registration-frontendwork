import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const ProfileScreen = () => {
  const route = useRoute();
  const userId = route.params?.userId || '';
 
  const username = route.params?.username || '';
  const [bio, setBio] = useState('');
  const [name, setName] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
 
  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      console.log(userId);
      const response = await axios.get(`http://192.168.22.183:4000/profileget`, {
        params: { userId: userId }  // ✅ Pass userId as a query parameter
      });;
      setName(response.data.name);
      setBio(response.data.bio);
      setProfilePic(response.data.profilePic);
      console.log(profilePic);
    } catch (error) {
      console.error('Failed to fetch profile data', error);
    }
  };
 
  const pickFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: ['image/*'] });
    if (!result.canceled) setFile(result.assets[0]);
  };

  const uploadToServer = async () => {
    if (!file) return alert('Please select a file');
    
    setUploading(true);
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('username', username);
    formData.append('name', name);
    formData.append('bio', bio);
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.mimeType,
    });
    
    try {
      const response = await axios.post('http://192.168.22.183:4000/profile-send', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(response.data.message);
      fetchProfileData();
    } catch (error) {
      alert('Upload failed: ' + (error.response?.data.message || 'Something went wrong'));
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Settings Button */}
      <TouchableOpacity style={styles.settingsButton} onPress={() => setShowSettings(!showSettings)}>
        <Ionicons name="settings" size={24} color="white" />
      </TouchableOpacity>
      
      {/* Profile Picture */}
      {profilePic && <Image source={{ uri: profilePic }} style={styles.profileImage} />}
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.bio}>{bio}</Text>
      
      {showSettings && (
        <View style={styles.formContainer}>
          <TextInput placeholder="Enter name" value={name} onChangeText={setName} style={styles.input} />
          <TextInput placeholder="Enter Bio" value={bio} onChangeText={setBio} style={styles.input} />
          <TouchableOpacity style={styles.fileButton} onPress={pickFile}>
            <Text style={styles.fileButtonText}>Choose File</Text>
          </TouchableOpacity>
          {file && <Text style={styles.fileText}>Selected: {file.name}</Text>}
          <TouchableOpacity style={styles.uploadButton} onPress={uploadToServer} disabled={uploading}>
            <Text style={styles.uploadButtonText}>{uploading ? 'Uploading...' : 'Upload'}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 50,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 16,
    color: '#555',
  },
  bio: {
    fontSize: 14,
    color: '#777',
    marginBottom: 20,
  },
  formContainer: {
    marginTop: 20,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    width: '100%',
  },
  fileButton: {
    padding: 10,
    backgroundColor: '#28a745',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  fileButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fileText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
  },
  uploadButton: {
    padding: 12,
    backgroundColor: '#dc3545',
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
