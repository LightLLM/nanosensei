/**
 * Progress Screen
 * Displays user's coaching session history and statistics
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session } from '../types';
import { backendClient } from '../api/BackendClient';

const STORAGE_KEY = '@nanosensei_sessions';

export default function ProgressScreen() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    total: number;
    averageScore: number;
    bySkill: Record<string, { count: number; avgScore: number }>;
  } | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      // Load from local storage
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const localSessions: Session[] = stored ? JSON.parse(stored) : [];

      // Try to fetch from backend (optional)
      try {
        const defaultUserId = 1; // In production, get from auth
        const backendSessions = await backendClient.fetchUserSessions(defaultUserId);
        // Merge with local sessions (backend is source of truth)
        setSessions(backendSessions.length > 0 ? backendSessions : localSessions);
      } catch (error) {
        console.warn('Backend fetch failed, using local storage:', error);
        setSessions(localSessions);
      }

      // Calculate statistics
      calculateStats(localSessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (sessionsList: Session[]) => {
    if (sessionsList.length === 0) {
      setStats(null);
      return;
    }

    const total = sessionsList.length;
    const totalScore = sessionsList.reduce((sum, s) => sum + s.score, 0);
    const averageScore = totalScore / total;

    const bySkill: Record<string, { count: number; avgScore: number }> = {};
    sessionsList.forEach((session) => {
      if (!bySkill[session.skillType]) {
        bySkill[session.skillType] = { count: 0, avgScore: 0 };
      }
      bySkill[session.skillType].count++;
      bySkill[session.skillType].avgScore += session.score;
    });

    // Calculate averages
    Object.keys(bySkill).forEach((skill) => {
      bySkill[skill].avgScore = Math.round(
        bySkill[skill].avgScore / bySkill[skill].count
      );
    });

    setStats({
      total,
      averageScore: Math.round(averageScore),
      bySkill,
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Your Progress</Text>

        {stats ? (
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total Sessions</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.averageScore}</Text>
              <Text style={styles.statLabel}>Average Score</Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No sessions yet</Text>
            <Text style={styles.emptySubtext}>
              Start a coaching session to see your progress here
            </Text>
          </View>
        )}

        {stats && Object.keys(stats.bySkill).length > 0 && (
          <View style={styles.skillStatsContainer}>
            <Text style={styles.sectionTitle}>By Skill</Text>
            {Object.entries(stats.bySkill).map(([skill, data]) => (
              <View key={skill} style={styles.skillStatRow}>
                <Text style={styles.skillName}>{skill}</Text>
                <View style={styles.skillStatDetails}>
                  <Text style={styles.skillCount}>{data.count} sessions</Text>
                  <Text style={styles.skillAvg}>Avg: {data.avgScore}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {sessions.length > 0 && (
          <View style={styles.sessionsContainer}>
            <Text style={styles.sectionTitle}>Recent Sessions</Text>
            {sessions
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, 10)
              .map((session, index) => (
                <View key={index} style={styles.sessionCard}>
                  <View style={styles.sessionHeader}>
                    <Text style={styles.sessionSkill}>{session.skillType}</Text>
                    <Text style={styles.sessionScore}>{session.score}/100</Text>
                  </View>
                  <Text style={styles.sessionFeedback}>{session.feedback}</Text>
                  <Text style={styles.sessionDate}>
                    {formatDate(session.timestamp)}
                  </Text>
                </View>
              ))}
          </View>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6200ee',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  skillStatsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  skillStatRow: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  skillStatDetails: {
    alignItems: 'flex-end',
  },
  skillCount: {
    fontSize: 14,
    color: '#666',
  },
  skillAvg: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6200ee',
  },
  sessionsContainer: {
    marginBottom: 32,
  },
  sessionCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionSkill: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  sessionScore: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  sessionFeedback: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
    lineHeight: 22,
  },
  sessionDate: {
    fontSize: 12,
    color: '#999',
  },
});

