/**
 * Camera Session Screen
 * Main coaching interface with camera preview and AI inference
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { runLocalInference } from '../ai/LocalInferenceEngine';
import { backendClient } from '../api/BackendClient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '../types';

type CameraSessionScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'CameraSession'
>;

const STORAGE_KEY = '@nanosensei_sessions';

export default function CameraSessionScreen({
  route,
  navigation,
}: CameraSessionScreenProps) {
  const { skillType } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleCapture = async () => {
    if (!cameraRef.current || isProcessing) return;

    setIsProcessing(true);
    setResult(null);

    try {
      // Take a photo
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (!photo) {
        throw new Error('Failed to capture photo');
      }

      // Run local AI inference (simulated)
      const frameMeta = {
        uri: photo.uri,
        width: photo.width,
        height: photo.height,
        timestamp: Date.now(),
      };

      const inferenceResult = runLocalInference(frameMeta, skillType);
      setResult(inferenceResult);
    } catch (error) {
      Alert.alert('Error', 'Failed to process frame. Please try again.');
      console.error('Capture error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveSession = async () => {
    if (!result) return;

    try {
      const session: Session = {
        skillType,
        score: result.score,
        feedback: result.feedback,
        timestamp: Date.now(),
      };

      // Save locally
      const existingSessions = await AsyncStorage.getItem(STORAGE_KEY);
      const sessions: Session[] = existingSessions
        ? JSON.parse(existingSessions)
        : [];
      sessions.push(session);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));

      // Try to sync with backend (optional, won't fail if backend is unavailable)
      try {
        // For now, use a default user_id (in production, get from auth)
        const defaultUserId = 1;
        await backendClient.syncSession({
          user_id: defaultUserId,
          skill_type: skillType,
          score: result.score,
          feedback: result.feedback,
        });
      } catch (backendError) {
        console.warn('Backend sync failed (continuing with local storage):', backendError);
      }

      Alert.alert('Success', 'Session saved!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Progress'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save session.');
      console.error('Save error:', error);
    }
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            Camera permission is required to use NanoSensei
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        >
          <View style={styles.overlay}>
            {result && (
              <View style={styles.resultCard}>
                <Text style={styles.resultTitle}>Your Score</Text>
                <Text style={styles.resultScore}>{result.score}/100</Text>
                <Text style={styles.resultFeedback}>{result.feedback}</Text>
              </View>
            )}
          </View>
        </CameraView>
      </View>

      <View style={styles.controls}>
        <Text style={styles.skillTypeText}>Skill: {skillType}</Text>

        <TouchableOpacity
          style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}
          onPress={handleCapture}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.captureButtonText}>Capture Frame</Text>
          )}
        </TouchableOpacity>

        {result && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveSession}
          >
            <Text style={styles.saveButtonText}>Save Session</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.flipButton}
          onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
        >
          <Text style={styles.flipButtonText}>Flip Camera</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    maxWidth: '90%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  resultTitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  resultScore: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 16,
  },
  resultFeedback: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    lineHeight: 24,
  },
  controls: {
    backgroundColor: '#fff',
    padding: 20,
    gap: 12,
  },
  skillTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  captureButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  captureButtonDisabled: {
    backgroundColor: '#999',
  },
  captureButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  flipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  flipButtonText: {
    color: '#6200ee',
    fontSize: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

