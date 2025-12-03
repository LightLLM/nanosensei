/**
 * Backend API Client for Web Frontend
 * Connects to the NanoSensei FastAPI backend
 */

import axios from 'axios'

// TODO: Update this to your backend URL
// For local development: http://localhost:8000
// For production: http://your-ec2-ip:8000 or your domain
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface User {
  id: number
  username: string
  email?: string
  created_at: string
}

export interface Session {
  id: number
  user_id: number
  skill_type: string
  score: number
  feedback: string
  timestamp: string
  metadata?: string
}

export interface SessionCreate {
  user_id: number
  skill_type: string
  score: number
  feedback: string
  metadata?: string
}

export interface SessionSummary {
  total_sessions: number
  average_score: number
  average_score_by_skill: Record<string, number>
  sessions_by_skill: Record<string, number>
}

// Health check
export async function healthCheck(): Promise<{ status: string }> {
  const response = await api.get('/health')
  return response.data
}

// User endpoints
export async function createUser(username: string, email?: string): Promise<User> {
  const response = await api.post('/users', { username, email })
  return response.data
}

export async function getUser(userId: number): Promise<User> {
  const response = await api.get(`/users/${userId}`)
  return response.data
}

// Session endpoints
export async function createSession(session: SessionCreate): Promise<Session> {
  const response = await api.post('/sessions', session)
  return response.data
}

export async function getSessions(userId?: number, skillType?: string): Promise<Session[]> {
  const params = new URLSearchParams()
  if (userId) params.append('user_id', userId.toString())
  if (skillType) params.append('skill_type', skillType)
  
  const response = await api.get(`/sessions?${params.toString()}`)
  return response.data
}

export async function getSessionSummary(userId: number): Promise<SessionSummary> {
  const response = await api.get(`/sessions/summary?user_id=${userId}`)
  return response.data
}

export default api

