/**
 * Session Manager for Vercel-compatible session handling
 * Uses localStorage to persist user sessions across browser sessions
 */

export interface SessionInfo {
  user_id: string;
  has_data: boolean;
  swimmer_name?: string;
  new_session: boolean;
}

class SessionManager {
  private static instance: SessionManager;
  private sessionKey = 'usms_user_id';
  private sessionInfoKey = 'usms_session_info';

  private constructor() {}

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Get or create a user session
   */
  async getSession(): Promise<string> {
    let userId = this.getStoredUserId();
    
    if (!userId) {
      userId = await this.createNewSession();
    }
    
    return userId;
  }

  /**
   * Create a new session
   */
  async createNewSession(): Promise<string> {
    try {
      const response = await fetch('/api/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const data = await response.json();
      const userId = data.user_id;
      
      this.storeUserId(userId);
      return userId;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }

  /**
   * Get session information
   */
  async getSessionInfo(): Promise<SessionInfo> {
    const userId = await this.getSession();
    
    try {
      const response = await fetch('/api/session', {
        method: 'GET',
        headers: {
          'X-User-ID': userId
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get session info');
      }

      const sessionInfo: SessionInfo = await response.json();
      this.storeSessionInfo(sessionInfo);
      return sessionInfo;
    } catch (error) {
      console.error('Error getting session info:', error);
      throw error;
    }
  }

  /**
   * Clear the current session
   */
  async clearSession(): Promise<void> {
    const userId = this.getStoredUserId();
    
    if (userId) {
      try {
        await fetch('/api/session', {
          method: 'DELETE',
          headers: {
            'X-User-ID': userId
          }
        });
      } catch (error) {
        console.error('Error clearing session:', error);
      }
    }
    
    this.clearStoredSession();
  }

  /**
   * Make an authenticated API request
   */
  async authenticatedRequest<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const userId = await this.getSession();
    
    const headers = {
      'Content-Type': 'application/json',
      'X-User-ID': userId,
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Check if user has data
   */
  async hasData(): Promise<boolean> {
    try {
      const sessionInfo = await this.getSessionInfo();
      return sessionInfo.has_data;
    } catch (error) {
      console.error('Error checking if user has data:', error);
      return false;
    }
  }

  /**
   * Get stored user ID from localStorage
   */
  private getStoredUserId(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(this.sessionKey);
  }

  /**
   * Store user ID in localStorage
   */
  private storeUserId(userId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.sessionKey, userId);
  }

  /**
   * Store session info in localStorage
   */
  private storeSessionInfo(sessionInfo: SessionInfo): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.sessionInfoKey, JSON.stringify(sessionInfo));
  }

  /**
   * Get stored session info from localStorage
   */
  getStoredSessionInfo(): SessionInfo | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(this.sessionInfoKey);
    return stored ? JSON.parse(stored) : null;
  }

  /**
   * Clear stored session data
   */
  private clearStoredSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(this.sessionKey);
    localStorage.removeItem(this.sessionInfoKey);
  }

  /**
   * Check if session is valid
   */
  isSessionValid(): boolean {
    return this.getStoredUserId() !== null;
  }
}

// Export singleton instance
export const sessionManager = SessionManager.getInstance();

// Export types
export type { SessionManager }; 