import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { useState, useRef, useCallback } from 'react';
import { Alert } from 'react-native';
import api from '../services/axiosConfig';

// Cache for sound objects
const soundCache = new Map<string, Audio.Sound>();

export const useOptimizedTTS = () => {
  const [isLoading, setIsLoading] = useState(false);
  const currentSound = useRef<Audio.Sound | null>(null);

  const generateCacheKey = (text: string) => {
    return `tts_${text.slice(0, 50)}_${text.length}`;
  };

  const playTTS = useCallback(async (text: string) => {
    try {
      setIsLoading(true);
      const cacheKey = generateCacheKey(text);

      // Stop any currently playing audio
      if (currentSound.current) {
        await currentSound.current.stopAsync();
        currentSound.current = null;
      }

      // Check cache first
      let sound = soundCache.get(cacheKey);
      if (!sound) {
        // Create new sound object
        sound = new Audio.Sound();

        // Make API request
        const response = await fetch(`${api.defaults.baseURL}/tts/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        });

        if (!response.ok) throw new Error('TTS request failed');

        // Get audio data as blob
        const blob = await response.blob();

        // Generate a temporary file path
        const tempFilePath = `${FileSystem.cacheDirectory}${cacheKey}.wav`;

        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
          const base64Data = typeof reader.result === 'string' ? reader.result.split(',')[1] : null;

          if (base64Data) {
            // Write the base64 data to the temporary file
            await FileSystem.writeAsStringAsync(tempFilePath, base64Data, {
              encoding: FileSystem.EncodingType.Base64,
            });

            // Load audio from the temporary file
            await sound?.loadAsync({ uri: tempFilePath });

            // Cache the sound object
            if (sound) {
              soundCache.set(cacheKey, sound);
            }

            // Play audio
            if (sound) {
              currentSound.current = sound;
            }
            await sound?.playAsync();

            // Clean up when done
            sound?.setOnPlaybackStatusUpdate((status) => {
              if (status.isLoaded && !status.isBuffering && status.didJustFinish) {
                sound?.unloadAsync();
                soundCache.delete(cacheKey);
                FileSystem.deleteAsync(tempFilePath, { idempotent: true });
              }
            });
          }
        };
      } else {
        // Play cached audio
        currentSound.current = sound;
        await sound.playAsync();
      }
    } catch (error) {
      console.error('TTS error:', error);
      Alert.alert('Error', 'Failed to play audio');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { playTTS, isLoading };
};

export default useOptimizedTTS;
