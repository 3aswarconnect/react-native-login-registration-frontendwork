import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

const { height, width } = Dimensions.get('window');

const categories = ['All', 'Entertainment', 'Education', 'Technology', 'Travel', 'Food', 'Fitness', 'Music', 'Comedy', 'Motivation', 'Fashion', 'News', 'Happy', 'Sad', 'Angry'];

const VideoItem = React.memo(({ item, isActive, index, screenFocused }) => {
  const playerRef = useRef(null);
  
  const player = useVideoPlayer(
    { uri: item.fileUrl },
    (player) => {
      playerRef.current = player;
      player.loop = true;
      
      // Set initial volume based on active state and screen focus
      player.volume = (isActive && screenFocused) ? 1.0 : 0.0;
      
      // Always play the video, but control volume instead
      try {
        player.play();
      } catch (error) {
        console.log(`Error playing video ${index}:`, error);
      }
    }
  );

  // Effect for handling active item changes
  useEffect(() => {
    if (playerRef.current) {
      try {
        // Set volume based on both active state AND screen focus
        playerRef.current.volume = (isActive && screenFocused) ? 1.0 : 0.0;
        
        // Ensure the video is playing if it's active
        if (isActive && screenFocused) {
          playerRef.current.play();
        }
      } catch (error) {
        console.log(`Error updating volume for video ${index}:`, error);
      }
    }
  }, [isActive, screenFocused, index]);

  return (
    <View style={styles.videoContainer}>
      <VideoView 
        style={styles.video} 
        player={player} 
        allowsFullscreen={false} 
        allowsPictureInPicture={false} 
        controls={false} 
      />
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
});

const ReelsScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [videos, setVideos] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [screenFocused, setScreenFocused] = useState(true);
  const flatListRef = useRef(null);
  const playerRefs = useRef([]);

  useEffect(() => {
    fetchVideos(selectedCategory);
  }, [selectedCategory]);

  const fetchVideos = async (category) => {
    try {
      const response = await axios.get(`http://192.168.22.183:4000/reels?category=${category}`);
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  // Handle screen focus changes
  useFocusEffect(
    useCallback(() => {
      // When the screen comes into focus
      setScreenFocused(true);
      
      // When navigating away from this screen
      return () => {
        setScreenFocused(false);
      };
    }, [])
  );

  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category);
    setActiveIndex(0);
    // Scroll back to top when changing category
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, []);

  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;
      setActiveIndex(newIndex);
    }
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
        ref={flatListRef}
        data={videos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <VideoItem 
            item={item} 
            isActive={index === activeIndex} 
            index={index}
            screenFocused={screenFocused}
          />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        getItemLayout={(data, index) => ({ length: height, offset: height * index, index })}
        windowSize={3}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        removeClippedSubviews={true}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        snapToInterval={height}
        decelerationRate="fast"
        snapToAlignment="start"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  filterContainer: { 
    position: 'absolute', 
    top: 50, 
    zIndex: 10, 
    width: '100%', 
    paddingHorizontal: 10 
  },
  categoryButton: { 
    padding: 10, 
    borderRadius: 20, 
    marginRight: 10, 
    backgroundColor: 'rgba(68, 68, 68, 0.7)' 
  },
  selectedCategory: { 
    backgroundColor: '#007bff' 
  },
  categoryText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  videoContainer: { 
    height: height,
    width: width,
    position: 'relative',
  },
  video: { 
    width: '100%', 
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  descriptionContainer: {
    position: 'absolute',
    bottom: 80,
    left: 10,
    right: 10,
    padding: 5,
  },
  description: { 
    color: '#fff', 
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});

export default ReelsScreen;