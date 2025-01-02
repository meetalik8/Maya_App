import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '..';
import { Ionicons } from '@expo/vector-icons'; // For TTS and STT icons
import { Phrase } from '../constants/phrases';

const { width } = Dimensions.get('window');

const PhraseLearnScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { phrase } = route.params as { phrase: Phrase };

  const [progress, setProgress] = useState(0.1);
  const [input, setInput] = useState('');

  const handleNext = () => {
    setProgress((prev) => Math.min(1, prev + 0.1));
    navigation.goBack(); // Placeholder for advancing to the next phrase
  };

  const handlePlayPhrase = () => {
    // Placeholder for TTS logic (Text-to-Speech)
    console.log("Play phrase:", phrase.phrase);
  };

  const handleStartSpeechRecognition = () => {
    // Placeholder for STT logic (Speech-to-Text)
    console.log("Start speech recognition");
  };

  const progressPercentage = progress * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Learn This Phrase</Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Animated.View
          style={[styles.progressBar, { width: `${progressPercentage}%` }]}
        />
      </View>

      {/* Phrase Card */}
      <View style={styles.card}>
        <Text style={styles.label}>English Phrase:</Text>
        <Text style={styles.value}>{phrase.phrase}</Text>

        <Text style={styles.label}>Translation:</Text>
        <Text style={styles.value}>{phrase.translation}</Text>

        <Text style={styles.label}>Pronunciation:</Text>
        <Text style={styles.value}>{phrase.transliteration}</Text>
      </View>

      {/* Interaction Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handlePlayPhrase} style={styles.button}>
          <Ionicons name="volume-high" size={24} color="#fff" />
          <Text style={styles.buttonText}>Listen to Phrase</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleStartSpeechRecognition} style={styles.button}>
          <Ionicons name="mic" size={24} color="#fff" />
          <Text style={styles.buttonText}>Speak the Phrase</Text>
        </TouchableOpacity>
      </View>

      {/* Next Phrase Button */}
      <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
        <Text style={styles.nextButtonText}>Next Phrase</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center', // Center align content
    justifyContent: 'center', // Center align content
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3a3a3a',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Poppins',
  },
  progressContainer: {
    height: 8,
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 25,
    width: '100%',
    maxWidth: 350,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  label: {
    fontSize: 16,
    color: '#3a3a3a',
    marginBottom: 5,
    fontWeight: '600',
  },
  value: {
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
    fontFamily: 'Roboto',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    width: '100%',
    maxWidth: 350,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    width: '45%',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  nextButton: {
    backgroundColor: '#3a3a3a',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    width: '100%',
    maxWidth: 350,
    elevation: 5,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
});

export default PhraseLearnScreen;
