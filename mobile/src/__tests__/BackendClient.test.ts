/**
 * Unit tests for BackendClient
 * Tests API communication with mocked fetch
 */

import BackendClient from '../api/BackendClient';

// Mock fetch globally
global.fetch = jest.fn();

describe('BackendClient', () => {
  const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('healthCheck', () => {
    it('should return health status', async () => {
      const mockResponse = { status: 'ok' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const client = new BackendClient('http://localhost:8000');
      const result = await client.healthCheck();

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/health',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should handle API errors', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Internal server error' }),
      } as Response);

      const client = new BackendClient('http://localhost:8000');
      await expect(client.healthCheck()).rejects.toThrow('API request failed');
    });
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      } as Response);

      const client = new BackendClient('http://localhost:8000');
      const result = await client.createUser('testuser', 'test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/users',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ username: 'testuser', email: 'test@example.com' }),
        })
      );
    });

    it('should create user without email', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: null,
        created_at: new Date().toISOString(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      } as Response);

      const client = new BackendClient('http://localhost:8000');
      const result = await client.createUser('testuser');

      expect(result).toEqual(mockUser);
    });
  });

  describe('getUser', () => {
    it('should fetch user by ID', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        created_at: new Date().toISOString(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      } as Response);

      const client = new BackendClient('http://localhost:8000');
      const result = await client.getUser(1);

      expect(result).toEqual(mockUser);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/users/1',
        expect.any(Object)
      );
    });
  });

  describe('syncSession', () => {
    it('should sync session successfully', async () => {
      const mockSession = {
        id: 1,
        user_id: 1,
        skill_type: 'Drawing',
        score: 85,
        feedback: 'Great work!',
        timestamp: new Date().toISOString(),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSession,
      } as Response);

      const client = new BackendClient('http://localhost:8000');
      const result = await client.syncSession({
        user_id: 1,
        skill_type: 'Drawing',
        score: 85,
        feedback: 'Great work!',
      });

      expect(result).toEqual(mockSession);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/sessions',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            user_id: 1,
            skill_type: 'Drawing',
            score: 85,
            feedback: 'Great work!',
          }),
        })
      );
    });
  });

  describe('fetchUserSessions', () => {
    it('should fetch user sessions', async () => {
      const mockSessions = [
        {
          id: 1,
          user_id: 1,
          skill_type: 'Drawing',
          score: 85,
          feedback: 'Great work!',
          timestamp: new Date().toISOString(),
        },
        {
          id: 2,
          user_id: 1,
          skill_type: 'Yoga',
          score: 90,
          feedback: 'Excellent!',
          timestamp: new Date().toISOString(),
        },
      ];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSessions,
      } as Response);

      const client = new BackendClient('http://localhost:8000');
      const result = await client.fetchUserSessions(1);

      expect(result).toEqual(mockSessions);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/sessions?user_id=1',
        expect.any(Object)
      );
    });
  });

  describe('getSessionSummary', () => {
    it('should fetch session summary', async () => {
      const mockSummary = {
        total_sessions: 5,
        average_score: 85.0,
        average_score_by_skill: {
          Drawing: 80.0,
          Yoga: 90.0,
        },
        sessions_by_skill: {
          Drawing: 3,
          Yoga: 2,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockSummary,
      } as Response);

      const client = new BackendClient('http://localhost:8000');
      const result = await client.getSessionSummary(1);

      expect(result).toEqual(mockSummary);
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8000/sessions/summary?user_id=1',
        expect.any(Object)
      );
    });
  });

  describe('error handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const client = new BackendClient('http://localhost:8000');
      await expect(client.healthCheck()).rejects.toThrow('API request failed');
    });

    it('should handle invalid JSON responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      } as Response);

      const client = new BackendClient('http://localhost:8000');
      await expect(client.healthCheck()).rejects.toThrow();
    });
  });
});

