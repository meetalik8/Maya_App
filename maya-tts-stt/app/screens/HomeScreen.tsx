import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '..';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Language Learning</Text>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: '#4CAF50' }]} // Green for Greetings
        onPress={() => navigation.navigate('PhraseList', { module: 'Greetings' })}
      >
        <MaterialCommunityIcons name="message-text" size={50} color="#fff" />
        <Text style={styles.cardTitle}>Greetings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: '#FF9800' }]} // Orange for Survival
        onPress={() => navigation.navigate('PhraseList', { module: 'Survival' })}
      >
        <MaterialCommunityIcons name="shield-check" size={50} color="#fff" />
        <Text style={styles.cardTitle}>Survival</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.card, { backgroundColor: '#2196F3' }]} // Blue for Travel
        onPress={() => navigation.navigate('PhraseList', { module: 'Travel' })}
      >
        <MaterialCommunityIcons name="airplane-takeoff" size={50} color="#fff" />
        <Text style={styles.cardTitle}>Travel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e9f3fb',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
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
});

export default HomeScreen;
