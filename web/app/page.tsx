'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">
          🔥 NanoSensei
        </h1>
        <p className="text-2xl text-gray-600 mb-8">
          On-Device AI Skill Coach
        </p>
        
        <p className="text-lg text-gray-700 mb-12 leading-relaxed">
          Point your camera at yourself or an object and receive real-time
          coaching feedback powered by on-device AI, optimized for Arm-based devices.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/session/setup"
            className="bg-primary hover:bg-primary-dark text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Start Coaching Session
          </Link>

          <Link
            href="/progress"
            className="bg-white hover:bg-gray-50 text-primary font-semibold py-4 px-8 rounded-lg text-lg border-2 border-primary transition-colors shadow-lg hover:shadow-xl"
          >
            View Progress
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Optimized for Arm-based devices and AWS Graviton</p>
        </div>
      </div>
    </main>
  )
}

