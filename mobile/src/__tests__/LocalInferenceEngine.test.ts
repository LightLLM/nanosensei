/**
 * Unit tests for LocalInferenceEngine
 * Tests the on-device AI inference simulation
 */

import { runLocalInference, initializeInferenceEngine, cleanupInferenceEngine } from '../ai/LocalInferenceEngine';
import { FrameMeta } from '../types';

describe('LocalInferenceEngine', () => {
  describe('runLocalInference', () => {
    it('should return a valid inference result', () => {
      const frameMeta: FrameMeta = {
        uri: 'file://test.jpg',
        width: 1920,
        height: 1080,
        timestamp: Date.now(),
      };

      const result = runLocalInference(frameMeta, 'Drawing');

      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('feedback');
      expect(typeof result.score).toBe('number');
      expect(typeof result.feedback).toBe('string');
    });

    it('should return score between 0 and 100', () => {
      const frameMeta: FrameMeta = {
        uri: 'file://test.jpg',
        width: 1920,
        height: 1080,
        timestamp: Date.now(),
      };

      const result = runLocalInference(frameMeta, 'Drawing');

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });

    it('should return feedback for Drawing skill', () => {
      const frameMeta: FrameMeta = {
        uri: 'file://test.jpg',
        width: 1920,
        height: 1080,
        timestamp: Date.now(),
      };

      const result = runLocalInference(frameMeta, 'Drawing');
      const drawingFeedback = [
        'Great line work! Keep practicing your strokes.',
        'Nice composition. Try varying your line weights.',
        'Good form! Focus on shading techniques.',
        'Excellent perspective. Work on proportions.',
      ];

      expect(drawingFeedback).toContain(result.feedback);
    });

    it('should return feedback for Yoga skill', () => {
      const frameMeta: FrameMeta = {
        uri: 'file://test.jpg',
        width: 1920,
        height: 1080,
        timestamp: Date.now(),
      };

      const result = runLocalInference(frameMeta, 'Yoga');
      const yogaFeedback = [
        'Perfect alignment! Hold the pose longer.',
        'Great flexibility. Remember to breathe deeply.',
        'Good form! Focus on your balance.',
        'Excellent posture. Keep your core engaged.',
      ];

      expect(yogaFeedback).toContain(result.feedback);
    });

    it('should return feedback for Punching skill', () => {
      const frameMeta: FrameMeta = {
        uri: 'file://test.jpg',
        width: 1920,
        height: 1080,
        timestamp: Date.now(),
      };

      const result = runLocalInference(frameMeta, 'Punching');
      const punchingFeedback = [
        'Strong technique! Keep your guard up.',
        'Good power. Focus on speed and accuracy.',
        'Excellent form! Remember to pivot your hips.',
        'Great follow-through. Work on combinations.',
      ];

      expect(punchingFeedback).toContain(result.feedback);
    });

    it('should return feedback for Guitar skill', () => {
      const frameMeta: FrameMeta = {
        uri: 'file://test.jpg',
        width: 1920,
        height: 1080,
        timestamp: Date.now(),
      };

      const result = runLocalInference(frameMeta, 'Guitar');
      const guitarFeedback = [
        'Nice finger placement! Practice chord transitions.',
        'Good rhythm. Focus on strumming consistency.',
        'Excellent technique! Work on fingerpicking.',
        'Great sound! Keep practicing scales.',
      ];

      expect(guitarFeedback).toContain(result.feedback);
    });

    it('should return default feedback for unknown skill type', () => {
      const frameMeta: FrameMeta = {
        uri: 'file://test.jpg',
        width: 1920,
        height: 1080,
        timestamp: Date.now(),
      };

      const result = runLocalInference(frameMeta, 'UnknownSkill');

      expect(result.feedback).toBe('Keep practicing!');
    });

    it('should return consistent results for same frame', () => {
      const frameMeta: FrameMeta = {
        uri: 'file://test.jpg',
        width: 1920,
        height: 1080,
        timestamp: 1234567890, // Fixed timestamp
      };

      const result1 = runLocalInference(frameMeta, 'Drawing');
      const result2 = runLocalInference(frameMeta, 'Drawing');

      // Should be deterministic based on timestamp
      expect(result1.score).toBe(result2.score);
      expect(result1.feedback).toBe(result2.feedback);
    });

    it('should handle different frame dimensions', () => {
      const frameMeta1: FrameMeta = {
        uri: 'file://test1.jpg',
        width: 640,
        height: 480,
        timestamp: Date.now(),
      };

      const frameMeta2: FrameMeta = {
        uri: 'file://test2.jpg',
        width: 3840,
        height: 2160,
        timestamp: Date.now() + 1000,
      };

      const result1 = runLocalInference(frameMeta1, 'Drawing');
      const result2 = runLocalInference(frameMeta2, 'Drawing');

      expect(result1.score).toBeGreaterThanOrEqual(0);
      expect(result1.score).toBeLessThanOrEqual(100);
      expect(result2.score).toBeGreaterThanOrEqual(0);
      expect(result2.score).toBeLessThanOrEqual(100);
    });
  });

  describe('initializeInferenceEngine', () => {
    it('should initialize without errors', async () => {
      await expect(initializeInferenceEngine()).resolves.not.toThrow();
    });
  });

  describe('cleanupInferenceEngine', () => {
    it('should cleanup without errors', () => {
      expect(() => cleanupInferenceEngine()).not.toThrow();
    });
  });
});

