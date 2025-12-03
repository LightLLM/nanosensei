'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SKILL_TYPES = ['Drawing', 'Yoga', 'Punching', 'Guitar']

export default function SessionSetupPage() {
  const router = useRouter()
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)

  const handleStartSession = () => {
    if (selectedSkill) {
      router.push(`/session/camera?skill=${encodeURIComponent(selectedSkill)}`)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="text-primary hover:text-primary-dark mb-6 inline-block"
        >
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Select Skill Type
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Choose the skill you want to practice and receive coaching on
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {SKILL_TYPES.map((skill) => (
            <button
              key={skill}
              onClick={() => setSelectedSkill(skill)}
              className={`p-6 rounded-lg border-2 transition-all ${
                selectedSkill === skill
                  ? 'border-primary bg-primary-light/20 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-primary hover:shadow-md'
              }`}
            >
              <h2
                className={`text-2xl font-semibold ${
                  selectedSkill === skill ? 'text-primary' : 'text-gray-800'
                }`}
              >
                {skill}
              </h2>
            </button>
          ))}
        </div>

        <button
          onClick={handleStartSession}
          disabled={!selectedSkill}
          className={`w-full py-4 px-8 rounded-lg font-semibold text-lg transition-colors ${
            selectedSkill
              ? 'bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Start Session
        </button>
      </div>
    </main>
  )
}

