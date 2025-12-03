'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { runLocalInference } from '@/lib/ai'
import { createSession } from '@/lib/api'

export default function CameraSessionPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const skillType = searchParams.get('skill') || 'Drawing'
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<{ score: number; feedback: string } | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Request camera access
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' } })
      .then((mediaStream) => {
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      })
      .catch((err) => {
        setError('Camera access denied. Please allow camera permissions.')
        console.error('Camera error:', err)
      })

    // Cleanup on unmount
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return

    setIsProcessing(true)
    setResult(null)

    try {
      const video = videoRef.current
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')

      if (!ctx) throw new Error('Could not get canvas context')

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0)

      // Get image data
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8)

      // Run local AI inference
      const frameMeta = {
        dataUrl,
        width: video.videoWidth,
        height: video.videoHeight,
        timestamp: Date.now(),
      }

      const inferenceResult = runLocalInference(frameMeta, skillType)
      setResult(inferenceResult)
    } catch (err) {
      setError('Failed to process frame. Please try again.')
      console.error('Capture error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSaveSession = async () => {
    if (!result) return

    try {
      // For now, use a default user_id (in production, get from auth)
      const defaultUserId = 1
      await createSession({
        user_id: defaultUserId,
        skill_type: skillType,
        score: result.score,
        feedback: result.feedback,
      })

      alert('Session saved successfully!')
      router.push('/progress')
    } catch (err) {
      alert('Failed to save session. Please try again.')
      console.error('Save error:', err)
    }
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Link
            href="/session/setup"
            className="text-primary hover:text-primary-dark"
          >
            ← Back to Setup
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/session/setup"
          className="text-white hover:text-gray-300 mb-4 inline-block"
        >
          ← Back
        </Link>

        <div className="bg-white rounded-lg p-6 mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Skill: {skillType}
          </h2>
        </div>

        <div className="relative bg-black rounded-lg overflow-hidden mb-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto"
          />
          <canvas ref={canvasRef} className="hidden" />

          {result && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
                <h3 className="text-lg text-gray-600 mb-2">Your Score</h3>
                <p className="text-6xl font-bold text-primary mb-4">
                  {result.score}/100
                </p>
                <p className="text-gray-700 text-lg">{result.feedback}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg p-6 space-y-4">
          <button
            onClick={handleCapture}
            disabled={isProcessing || !stream}
            className={`w-full py-4 px-8 rounded-lg font-semibold text-lg transition-colors ${
              isProcessing || !stream
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Capture Frame'}
          </button>

          {result && (
            <button
              onClick={handleSaveSession}
              className="w-full py-4 px-8 rounded-lg font-semibold text-lg bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-colors"
            >
              Save Session
            </button>
          )}
        </div>
      </div>
    </main>
  )
}

