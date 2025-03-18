import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import axios from 'axios';

const { height } = Dimensions.get('window');
const categories = ['All', 'Entertainment', 'Education', 'Technology', 'Travel', 'Food', 'Fitness', 'Music', 'Comedy', 'Motivation', 'Fashion', 'News', 'Happy', 'Sad', 'Angry'];

const MemeItem = React.memo(({ item }) => (
  <View style={styles.memeContainer}>
    <Image source={{ uri: item.fileUrl }} style={styles.meme} resizeMode="contain" />
    <Text style={styles.description}>{item.description}</Text>
  </View>
));

const MemesScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [memes, setMemes] = useState([]);

  useEffect(() => {
    fetchMemes(selectedCategory);
  }, [selectedCategory]);

  const fetchMemes = async (category) => {
    try {
      const response = await axios.get(`http://192.168.22.183:4000/memes?category=${category}`);
      setMemes(response.data);
    } catch (error) {
      console.error('Error fetching memes:', error);
    }
  };

  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryButton, selectedCategory === item && styles.selectedCategory]}
              onPress={() => handleCategorySelect(item)}
            >
              <Text style={styles.categoryText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={memes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <MemeItem item={item} />}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        getItemLayout={(data, index) => ({ length: height, offset: height * index, index })}
        windowSize={5}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        updateCellsBatchingPeriod={50}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  filterContainer: { position: 'absolute', top: 20, zIndex: 10, width: '100%', paddingHorizontal: 10 },
  categoryButton: { padding: 10, borderRadius: 20, marginRight: 10, backgroundColor: '#444' },
  selectedCategory: { backgroundColor: '#007bff' },
  categoryText: { color: '#fff', fontWeight: 'bold' },
  memeContainer: { height, justifyContent: 'center', alignItems: 'center' },
  meme: { width: '100%', height: '80%' },
  description: { position: 'absolute', bottom: 20, left: 20, color: '#fff', fontSize: 16 },
});

export default MemesScreen;