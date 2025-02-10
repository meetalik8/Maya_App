import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '..';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.header}>Language Learning</Text>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#4CAF50' }]}
          onPress={() => navigation.navigate('PhraseList', { module: 'Greetings' })}
        >
          <MaterialCommunityIcons name="hand-wave" size={50} color="#fff" />
          <Text style={styles.cardTitle}>Greetings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#2196F3' }]}
          onPress={() => navigation.navigate('PhraseList', { module: 'Travel' })}
        >
          <MaterialCommunityIcons name="airplane-takeoff" size={50} color="#fff" />
          <Text style={styles.cardTitle}>Travel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#E91E63' }]}
          onPress={() => navigation.navigate('PhraseList', { module: 'Emergency' })}
        >
          <MaterialCommunityIcons name="alert-circle" size={50} color="#fff" />
          <Text style={styles.cardTitle}>Emergency</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#FF9800' }]}
          onPress={() => navigation.navigate('PhraseList', { module: 'Hotel' })}
        >
          <FontAwesome5 name="hotel" size={50} color="#fff" />
          <Text style={styles.cardTitle}>Hotel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#8BC34A' }]}
          onPress={() => navigation.navigate('PhraseList', { module: 'Restaurant' })}
        >
          <MaterialCommunityIcons name="silverware-fork-knife" size={50} color="#fff" />
          <Text style={styles.cardTitle}>Restaurant</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#9C27B0' }]}
          onPress={() => navigation.navigate('PhraseList', { module: 'Shopping' })}
        >
          <MaterialCommunityIcons name="shopping" size={50} color="#fff" />
          <Text style={styles.cardTitle}>Shopping</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#03A9F4' }]}
          onPress={() => navigation.navigate('PhraseList', { module: 'Sightseeing' })}
        >
          <MaterialCommunityIcons name="binoculars" size={50} color="#fff" />
          <Text style={styles.cardTitle}>Sightseeing</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: '#FF5722' }]}
          onPress={() => navigation.navigate('PhraseList', { module: 'Health' })}
        >
          <Ionicons name="medkit" size={50} color="#fff" />
          <Text style={styles.cardTitle}>Health</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={28} color="#4CAF50" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="people" size={28} color="#FF9800" />
          <Text style={styles.navText}>Community</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ChatBot')}>
          <Ionicons name="chatbox-ellipses" size={28} color="#2196F3" />
          <Text style={styles.navText}>Live Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Home')}>
          <Ionicons name="person" size={28} color="#9C27B0" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9f3fb',
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 80, // Add padding to prevent content from overlapping the navbar
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 30,
    color: '#333',
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    height: 120,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 15,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#333',
    marginTop: 5,
  },
});

export default HomeScreen;
