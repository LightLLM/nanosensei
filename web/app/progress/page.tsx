'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSessions, getSessionSummary } from '@/lib/api'
import type { Session, SessionSummary } from '@/lib/api'

export default function ProgressPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [summary, setSummary] = useState<SessionSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      // For now, use default user_id (in production, get from auth)
      const defaultUserId = 1
      const [sessionsData, summaryData] = await Promise.all([
        getSessions(defaultUserId),
        getSessionSummary(defaultUserId),
      ])
      setSessions(sessionsData)
      setSummary(summaryData)
    } catch (err) {
      setError('Failed to load progress. Please check your backend connection.')
      console.error('Load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading progress...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/" className="text-primary hover:text-primary-dark">
            ← Back to Home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/"
          className="text-primary hover:text-primary-dark mb-6 inline-block"
        >
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Your Progress</h1>

        {summary && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-lg text-center">
                <p className="text-gray-600 mb-2">Total Sessions</p>
                <p className="text-4xl font-bold text-primary">
                  {summary.total_sessions}
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg text-center">
                <p className="text-gray-600 mb-2">Average Score</p>
                <p className="text-4xl font-bold text-primary">
                  {Math.round(summary.average_score)}
                </p>
              </div>
            </div>

            {Object.keys(summary.average_score_by_skill).length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  By Skill
                </h2>
                <div className="space-y-3">
                  {Object.entries(summary.average_score_by_skill).map(
                    ([skill, avgScore]) => (
                      <div
                        key={skill}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                      >
                        <span className="text-lg font-semibold text-gray-800">
                          {skill}
                        </span>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {summary.sessions_by_skill[skill]} sessions
                          </p>
                          <p className="text-lg font-bold text-primary">
                            Avg: {Math.round(avgScore)}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {sessions.length > 0 ? (
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Recent Sessions
            </h2>
            <div className="space-y-4">
              {sessions.slice(0, 10).map((session) => (
                <div
                  key={session.id}
                  className="border-b border-gray-200 pb-4 last:border-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {session.skill_type}
                    </h3>
                    <p className="text-2xl font-bold text-primary">
                      {session.score}/100
                    </p>
                  </div>
                  <p className="text-gray-700 mb-2">{session.feedback}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(session.timestamp)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center shadow-lg">
            <p className="text-gray-600 mb-4">No sessions yet</p>
            <p className="text-gray-500 mb-6">
              Start a coaching session to see your progress here
            </p>
            <Link
              href="/session/setup"
              className="inline-block bg-primary hover:bg-primary-dark text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Start Session
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}

