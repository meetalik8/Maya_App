import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

const useAudioRecording = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync();
      }
    };
  }, [recording]);

  const startRecording = async () => {
    try {
      // Request permissions
      const permissionResponse = await Audio.requestPermissionsAsync();
      if (permissionResponse.status !== 'granted') {
        console.error('Permission to access microphone was denied');
        return;
      }

      // Set audio mode first
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });

      // Create and prepare the recording
      console.log('Creating recording...');
      const newRecording = new Audio.Recording();
      
      try {
        await newRecording.prepareToRecordAsync({
          isMeteringEnabled: true,
          android: {
            extension: '.m4a',
            outputFormat: Audio.AndroidOutputFormat.MPEG_4,
            audioEncoder: Audio.AndroidAudioEncoder.AAC,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
          },
          ios: {
            extension: '.m4a',
            audioQuality: Audio.IOSAudioQuality.HIGH,
            sampleRate: 44100,
            numberOfChannels: 1,
            bitRate: 128000,
            outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          },
          web: {
            mimeType: 'audio/webm',
            bitsPerSecond: 128000,
          },
        });

        console.log('Starting recording...');
        await newRecording.startAsync();
        setRecording(newRecording);
        setIsRecording(true);
        console.log('Recording started');
      } catch (error) {
        console.error('Error in recording preparation:', error);
        throw error;
      }
    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsRecording(false);
      if (recording) {
        try {
          await recording.stopAndUnloadAsync();
        } catch (error) {
          console.error('Error cleaning up recording:', error);
        }
      }
    }
  };

  const stopRecording = async () => {
    console.log('Stopping recording...');
    if (!recording) {
      console.log('No recording to stop');
      return null;
    }

    try {
      await recording.stopAndUnloadAsync();
      console.log('Recording stopped');
      const uri = recording.getURI();
      console.log('Recording URI:', uri);

      if (!uri) {
        console.log('No URI from recording');
        return null;
      }

      // Verify the file exists
      const info = await FileSystem.getInfoAsync(uri);
      if (!info.exists) {
        console.log('Recording file does not exist');
        return null;
      }

      setAudioUri(uri);
      setIsRecording(false);
      setRecording(null);
      return uri;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setIsRecording(false);
      setRecording(null);
      return null;
    }
  };

  return { isRecording, audioUri, startRecording, stopRecording };
};

export default useAudioRecording;