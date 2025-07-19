import { UserSession, AnalysisResult } from '@/types/api';

// In-memory storage for development (in production, use a database)
const userSessions = new Map<string, UserSession>();
const userData = new Map<string, AnalysisResult>();

export class UserService {
  createUserSession(customUserId?: string): string {
    const userId = customUserId || this.generateUserId();
    const session: UserSession = {
      userId,
      swimmerName: ''
    };
    userSessions.set(userId, session);
    console.log(`Created user session: ${userId}, total sessions: ${userSessions.size}`);
    return userId;
  }

  getUserSessionInfo(userId: string): UserSession | null {
    const session = userSessions.get(userId) || null;
    console.log(`Getting session info for ${userId}: ${session ? 'found' : 'not found'}, total sessions: ${userSessions.size}`);
    return session;
  }

  storeUserData(userId: string, analysis: AnalysisResult): void {
    userData.set(userId, analysis);
    console.log(`Stored user data for ${userId}, total data entries: ${userData.size}`);
    
    // Update session with swimmer name
    const session = userSessions.get(userId);
    if (session) {
      session.swimmerName = analysis.swimmer.name;
      userSessions.set(userId, session);
      console.log(`Updated session swimmer name to: ${analysis.swimmer.name}`);
    } else {
      console.log(`Warning: No session found for ${userId} when storing data`);
      // Create session if it doesn't exist
      this.createUserSession(userId);
      const newSession = userSessions.get(userId);
      if (newSession) {
        newSession.swimmerName = analysis.swimmer.name;
        userSessions.set(userId, newSession);
      }
    }
  }

  getUserData(userId: string): AnalysisResult | null {
    const data = userData.get(userId) || null;
    console.log(`Getting user data for ${userId}: ${data ? 'found' : 'not found'}, total data entries: ${userData.size}`);
    if (data) {
      console.log(`User data contains ${data.performance.bestTimes.length} best times and ${Object.keys(data.eventDistribution).length} event types`);
    }
    return data;
  }

  clearUserData(userId: string): void {
    const hadSession = userSessions.has(userId);
    const hadData = userData.has(userId);
    userSessions.delete(userId);
    userData.delete(userId);
    console.log(`Cleared user ${userId}: session=${hadSession}, data=${hadData}, remaining sessions: ${userSessions.size}, remaining data: ${userData.size}`);
  }

  getActiveUsersCount(): number {
    return userSessions.size;
  }

  getTotalSessionsCount(): number {
    return userSessions.size;
  }

  // Debug method to log current state
  debugState(): void {
    console.log('=== UserService Debug State ===');
    console.log(`Sessions: ${userSessions.size}`);
    console.log(`Data entries: ${userData.size}`);
    console.log('Session IDs:', Array.from(userSessions.keys()));
    console.log('Data IDs:', Array.from(userData.keys()));
    console.log('===============================');
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const userService = new UserService(); 