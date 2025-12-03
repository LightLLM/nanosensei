/**
 * Type definitions for NanoSensei mobile app
 */

export interface FrameMeta {
  uri: string;
  width: number;
  height: number;
  timestamp: number;
}

export interface InferenceResult {
  score: number; // 0-100
  feedback: string;
}

export interface Session {
  id?: string;
  skillType: string;
  score: number;
  feedback: string;
  timestamp: number;
  userId?: number;
}

export interface User {
  id: number;
  username: string;
  email?: string;
}

