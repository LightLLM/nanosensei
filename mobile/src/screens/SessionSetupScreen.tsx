/**
 * Session Setup Screen
 * Allows user to select skill type before starting a coaching session
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type SessionSetupScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SessionSetup'
>;

interface Props {
  navigation: SessionSetupScreenNavigationProp;
}

const SKILL_TYPES = [
  'Drawing',
  'Yoga',
  'Punching',
  'Guitar',
];

export default function SessionSetupScreen({ navigation }: Props) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const handleStartSession = () => {
    if (selectedSkill) {
      navigation.navigate('CameraSession', { skillType: selectedSkill });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Select Skill Type</Text>
        <Text style={styles.subtitle}>
          Choose the skill you want to practice and receive coaching on
        </Text>

        <View style={styles.skillList}>
          {SKILL_TYPES.map((skill) => (
            <TouchableOpacity
              key={skill}
              style={[
                styles.skillCard,
                selectedSkill === skill && styles.skillCardSelected,
              ]}
              onPress={() => setSelectedSkill(skill)}
            >
              <Text
                style={[
                  styles.skillText,
                  selectedSkill === skill && styles.skillTextSelected,
                ]}
              >
                {skill}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.startButton,
            !selectedSkill && styles.startButtonDisabled,
          ]}
          onPress={handleStartSession}
          disabled={!selectedSkill}
        >
          <Text style={styles.startButtonText}>Start Session</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  skillList: {
    gap: 12,
    marginBottom: 32,
  },
  skillCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  skillCardSelected: {
    borderColor: '#6200ee',
    backgroundColor: '#f3e5f5',
  },
  skillText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  skillTextSelected: {
    color: '#6200ee',
    fontWeight: '600',
  },
  startButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  startButtonDisabled: {
    backgroundColor: '#ccc',
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

