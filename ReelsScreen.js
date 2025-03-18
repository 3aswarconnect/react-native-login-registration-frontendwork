import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useFocusEffect } from '@react-navigation/native';

import axios from 'axios';

const { height } = Dimensions.get('window');
const categories = ['All', 'Entertainment', 'Education', 'Technology', 'Travel', 'Food', 'Fitness', 'Music', 'Comedy', 'Motivation', 'Fashion', 'News', 'Happy', 'Sad', 'Angry'];

const VideoItem = React.memo(({ item, isPlaying, playerRef }) => {
  const player = useVideoPlayer(
    { uri: item.fileUrl },
    (player) => {
      player.loop = true;
      if (isPlaying) {
        player.play();
      } else {
        player.pause();
      }
    }
  );

  useEffect(() => {
    if (isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    playerRef.current = player;
  }, []);

  return (
    <View style={styles.videoContainer}>
      <VideoView style={styles.video} player={player} allowsFullscreen={false} allowsPictureInPicture={false} controls={false} />
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
});

const ReelsScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [videos, setVideos] = useState([]);
  const [playingIndex, setPlayingIndex] = useState(0);
  const videoRefs = useRef([]);

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
// Inside ReelsScreen component
useFocusEffect(
    useCallback(() => {
      return () => {
        // Pause the current playing video when navigating away
        if (videoRefs.current[playingIndex]) {
          videoRefs.current[playingIndex].current?.pause();
        }
      };
    }, [playingIndex])
  );
  const handleCategorySelect = useCallback((category) => {
    setSelectedCategory(category);
    setPlayingIndex(0);
  }, []);

  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index;

      // Pause previous video
      if (videoRefs.current[playingIndex]) {
        videoRefs.current[playingIndex].current?.pause();
      }

      setPlayingIndex(newIndex);

      // Play new video
      if (videoRefs.current[newIndex]) {
        videoRefs.current[newIndex].current?.play();
      }
    }
  }, [playingIndex]);

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
        data={videos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          videoRefs.current[index] = videoRefs.current[index] || React.createRef();
          return (
            <VideoItem item={item} isPlaying={index === playingIndex} playerRef={videoRefs.current[index]} />
          );
        }}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        getItemLayout={(data, index) => ({ length: height, offset: height * index, index })}
        windowSize={5}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        updateCellsBatchingPeriod={50}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
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
  videoContainer: { height, justifyContent: 'center', alignItems: 'center' },
  video: { width: '100%', height: '100%' },
  description: { position: 'absolute', bottom: 20, left: 20, color: '#fff', fontSize: 16 },
});

export default ReelsScreen;
