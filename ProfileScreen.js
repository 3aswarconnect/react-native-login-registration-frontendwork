import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';

const ProfileScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const userId = route.params?.userId || '';
  const username = route.params?.username || '';
  const [bio, setBio] = useState('');
  const [name, setName] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
 
  // Use useFocusEffect to refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchProfileData();
    }, [route.params?.refreshProfile])
  );

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      console.log(userId);
      const response = await axios.get(`http://192.168.22.183:4000/profileget`, {
        params: { userId: userId }
      });
      setName(response.data.name);
      setBio(response.data.bio);
      setProfilePic(response.data.profilePic);
      // If socialLinks exist in the response, set them
      if (response.data.socialLinks) {
        setSocialLinks(response.data.socialLinks);
      }
      console.log(profilePic);
    } catch (error) {
      console.error('Failed to fetch profile data', error);
    }
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings', {
      userId: userId,
      username: username,
      initialName: name,
      initialBio: bio,
      initialProfilePic: profilePic,
      initialSocialLinks: socialLinks
    });
  };

  const getIconName = (platform) => {
    const platform_lower = platform.toLowerCase();
    if (platform_lower.includes('youtube')) return 'logo-youtube';
    if (platform_lower.includes('twitter') || platform_lower.includes('x')) return 'logo-twitter';
    if (platform_lower.includes('instagram')) return 'logo-instagram';
    if (platform_lower.includes('facebook')) return 'logo-facebook';
    if (platform_lower.includes('linkedin')) return 'logo-linkedin';
    if (platform_lower.includes('github')) return 'logo-github';
    if (platform_lower.includes('tiktok')) return 'logo-tiktok';
    return 'link-outline';
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          {/* Settings Button */}
          <TouchableOpacity style={styles.settingsButton} onPress={navigateToSettings}>
            <Ionicons name="settings" size={24} color="#555" />
          </TouchableOpacity>
          
          {/* Username at top */}
          <Text style={styles.username}>@{username}</Text>
          
          {/* Profile Picture below username */}
          <View style={styles.profileImageContainer}>
            {profilePic ? (
              <Image source={{ uri: profilePic }} style={styles.profileImage} />
            ) : (
              <View style={[styles.profileImage, styles.placeholderImage]}>
                <Ionicons name="person" size={50} color="#ccc" />
              </View>
            )}
          </View>
          
          {/* Name below profile picture */}
          <Text style={styles.name}>{name}</Text>
          
          {/* Bio below name */}
          <Text style={styles.bio}>{bio}</Text>
          
          {/* Social Links Section */}
          {socialLinks && socialLinks.length > 0 && (
            <View style={styles.socialLinksContainer}>
              {socialLinks.map((link, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.socialLink}
                  onPress={() => {
                    // In a real app, you would open the URL here
                    Alert.alert("Opening Link", `Opening ${link.url}`);
                  }}
                >
                  <Ionicons name={getIconName(link.platform)} size={22} color="#555" />
                  <Text style={styles.socialLinkText}>{link.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  settingsButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    padding: 10,
    zIndex: 10,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 120,
    marginBottom: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  placeholderImage: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  bio: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  socialLinksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  socialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 5,
  },
  socialLinkText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 5,
  },
});

export default ProfileScreen;