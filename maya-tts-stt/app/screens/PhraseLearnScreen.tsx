import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../Maya';
import { Phrase } from '../constants/phrases';
import useAudioRecording from '../hooks/useAudioRecording';
import api from '../services/axiosConfig';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { useOptimizedTTS } from '../hooks/audioPlayer';

const PhraseLearnScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { phrase } = route.params as { phrase: Phrase };

  const [progress, setProgress] = useState(0.1);
  const [transcribedText, setTranscribedText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const { isRecording, startRecording, stopRecording } = useAudioRecording();
  // const [isLoading, setIsLoading] = useState(false);
  const { playTTS, isLoading } = useOptimizedTTS();

  const progressAnim = new Animated.Value(progress);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const handleNext = () => {
    if (accuracy !== null && accuracy > 70) {
      setProgress((prev) => Math.min(1, prev + 0.1));
      navigation.goBack();
    } else {
      Alert.alert(
        'Keep Practicing',
        'Try to achieve better accuracy before moving to the next phrase.',
        [{ text: 'OK', onPress: () => { } }]
      );
    }
  };

  const handlePlayPhrase = async () => {
    try {
      await playTTS(
        phrase.translation,
      );

      // Create a temporary file path
      const tempFilePath = FileSystem.documentDirectory + 'temp_audio.wav';

      // Convert blob to base64 using FileReader
      const fr = new FileReader();
      fr.onload = async () => {
        const base64Data = (fr.result as string).split(',')[1];

        // Write the audio data to a temporary file
        await FileSystem.writeAsStringAsync(tempFilePath, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // Play the audio using Expo's Audio API
        const soundObject = new Audio.Sound();
        await soundObject.loadAsync({ uri: tempFilePath });
        await soundObject.playAsync();

        // Clean up after playing
        soundObject.setOnPlaybackStatusUpdate(async (status) => {
          if (status.isLoaded && status.didJustFinish) {
            await soundObject.unloadAsync();
            // Delete the temporary file
            await FileSystem.deleteAsync(tempFilePath, { idempotent: true });
          }
        });
      };



    } catch (error: any) {
      console.error('TTS error:', error);
      Alert.alert(
        'Error',
        'Failed to play audio. Please try again.' + (error.message ? `\n\nDetails: ${error.message}` : '')
      );
    }
  };

  const calculateSimilarity = (str1: string, str2: string): number => {
    const maxLength = Math.max(str1.length, str2.length);
    const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
    return Math.round((1 - distance / maxLength) * 100);
  };

  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null)
    );

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const substitute = matrix[j - 1][i - 1] + (str1[i - 1] !== str2[j - 1] ? 1 : 0);
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1, // deletion
          matrix[j][i - 1] + 1, // insertion
          substitute // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  };

  const handleStartSpeechRecognition = async () => {
    if (isRecording) {
      const audioFilePath = await stopRecording();

      if (!audioFilePath) {
        Alert.alert('Error', 'Failed to record audio. Please try again.');
        return;
      }

      setIsProcessing(true);
      console.log('Sending audio for transcription:', audioFilePath);

      try {
        // Create form data
        const formData = new FormData();
        formData.append('file', {
          uri: audioFilePath,
          type: 'audio/m4a',
          name: 'recording.m4a',
        } as any);

        // Set the correct headers
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          },
        };

        const response = await api.post('/transcribe/', formData, config);
        const { transcription } = response.data;
        console.log('Received transcription:', transcription);
        setTranscribedText(transcription);

        const expectedText = phrase.translation;
        const similarity = calculateSimilarity(transcription, expectedText);
        console.log('Calculated similarity:', similarity);
        setAccuracy(similarity);
      } catch (error) {
        console.error('Speech recognition error:', error);
        Alert.alert(
          'Error',
          'Failed to process audio. Please check your internet connection and try again.'
        );
      } finally {
        setIsProcessing(false);
      }
    } else {
      console.log('Starting recording...');
      startRecording();
    }
  };

  const getAccuracyColor = (acc: number) => {
    if (acc >= 90) return '#4CAF50';
    if (acc >= 70) return '#FFA726';
    return '#F44336';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Learn This Phrase</Text>

      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>English Phrase:</Text>
        <Text style={styles.value}>{phrase.phrase}</Text>

        <Text style={styles.label}>Translation:</Text>
        <Text style={styles.value}>{phrase.translation}</Text>

        <Text style={styles.label}>Pronunciation:</Text>
        <Text style={styles.value}>{phrase.transliteration}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handlePlayPhrase}
          style={styles.button}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="volume-high" size={24} color="#fff" />
              <Text style={styles.buttonText}>Listen</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleStartSpeechRecognition}
          style={[styles.button, isRecording && styles.recordingButton]}
          disabled={isProcessing}
        >
          <Ionicons name={isRecording ? 'stop' : 'mic'} size={24} color="#fff" />
          <Text style={styles.buttonText}>
            {isRecording ? 'Stop' : 'Record'}
          </Text>
        </TouchableOpacity>
      </View>

      {isProcessing && (
        <View style={styles.processingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.processingText}>Processing audio...</Text>
        </View>
      )}

      {transcribedText && (
        <View style={styles.transcriptionContainer}>
          <Text style={styles.transcriptionLabel}>Your speech:</Text>
          <Text style={styles.transcriptionText}>{transcribedText}</Text>
          {accuracy !== null && (
            <Text style={[styles.accuracyText, { color: '#3884fd' }]}>
              Accuracy: {accuracy}%
            </Text>
          )}
        </View>
      )}

      <TouchableOpacity
        onPress={handleNext}
        style={[
          styles.nextButton,
          (!accuracy || accuracy <= 70) && styles.nextButtonDisabled,
        ]}
      >
        <Text style={styles.nextButtonText}>Next Phrase</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
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
    backgroundColor: '#3884fd',
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
    backgroundColor: '#3884fd',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 30,
    width: '45%',
    justifyContent: 'center',
    elevation: 4,
  },
  recordingButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    fontFamily: 'Roboto',
  },
  processingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  processingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  transcriptionContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    width: '100%',
  },
  transcriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  transcriptionText: {
    fontSize: 16,
    color: '#333',
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
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  accuracyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#cccccc',
  },
});

export default PhraseLearnScreen;
