import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';

const UploadScreen = () => {
  const route = useRoute();
  const userId = route.params?.userId || '';
  const [category, setCategory] = useState('Education');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const categories = ['Education', 'Technology', 'Travel', 'Food', 'Fitness', 'Music', 'Comedy', 'Motivation', 'Fashion', 'News'];

  const pickFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: ['video/*', 'image/*'],
    });
    if (!result.canceled) setFile(result.assets[0]);
  };

  const uploadToServer = async () => {
    if (!file) return alert('Please select a file');
    
    setUploading(true);

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('category', category);
    formData.append('description', description);
    formData.append('isPublic', isPublic ? 'true' : 'false');
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.mimeType,
    });
    
    try {
      const response = await axios.post('http://192.168.22.183:4000/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(response.data.message);
    } catch (error) {
      alert('Upload failed: ' + (error.response?.data.message || 'Something went wrong'));
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Category:</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={category} onValueChange={setCategory} style={styles.picker}>
          {categories.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} />
          ))}
        </Picker>
      </View>

      <TextInput
        placeholder="Enter description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>{isPublic ? 'Public' : 'Private'}</Text>
        <Switch value={isPublic} onValueChange={setIsPublic} />
      </View>

      <TouchableOpacity style={styles.fileButton} onPress={pickFile}>
        <Text style={styles.fileButtonText}>Choose File</Text>
      </TouchableOpacity>
      {file && <Text style={styles.fileText}>Selected: {file.name}</Text>}

      <TouchableOpacity style={styles.uploadButton} onPress={uploadToServer} disabled={uploading}>
        <Text style={styles.uploadButtonText}>{uploading ? 'Uploading...' : 'Upload'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  picker: {
    height: 40,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: 'bold',
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

export default UploadScreen;
