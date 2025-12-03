/**
 * Backend API Client
 * 
 * Handles communication with the NanoSensei FastAPI backend.
 * The backend runs on AWS Graviton (arm64) for optimal performance.
 */

import { Session, User } from '../types';

// TODO: Update this to your backend URL
// For local development: http://localhost:8000
// For production: http://<YOUR_EC2_IP>:8000 or your domain
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8000'  // Local development
  : 'http://your-ec2-ip:8000'; // Production - update with your EC2 IP

interface ApiError {
  message: string;
  status?: number;
}

class BackendClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(error.detail || error.message || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`API request failed: ${error.message}`);
      }
      throw new Error('API request failed: Unknown error');
    }
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<{ status: string }> {
    return this.request<{ status: string }>('/health');
  }

  /**
   * Create a new user
   */
  async createUser(username: string, email?: string): Promise<User> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify({ username, email }),
    });
  }

  /**
   * Get user by ID
   */
  async getUser(userId: number): Promise<User> {
    return this.request<User>(`/users/${userId}`);
  }

  /**
   * Create a new session
   */
  async syncSession(sessionData: {
    user_id: number;
    skill_type: string;
    score: number;
    feedback: string;
    metadata?: string;
  }): Promise<Session> {
    return this.request<Session>('/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  /**
   * Fetch sessions for a user
   */
  async fetchUserSessions(userId: number): Promise<Session[]> {
    return this.request<Session[]>(`/sessions?user_id=${userId}`);
  }

  /**
   * Get session summary/statistics
   */
  async getSessionSummary(userId: number): Promise<{
    total_sessions: number;
    average_score: number;
    average_score_by_skill: Record<string, number>;
    sessions_by_skill: Record<string, number>;
  }> {
    return this.request(`/sessions/summary?user_id=${userId}`);
  }
}

export const backendClient = new BackendClient();
export default BackendClient;

