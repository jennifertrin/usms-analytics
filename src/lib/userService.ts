import { UserSession, AnalysisResult } from '@/types/api';

// In-memory storage for development (in production, use a database)
const userSessions = new Map<string, UserSession>();
const userData = new Map<string, AnalysisResult>();

export class UserService {
  createUserSession(customUserId?: string): string {
    const userId = customUserId || this.generateUserId();
    userSessions.set(userId, {
      userId,
      swimmerName: ''
    });
    return userId;
  }

  getUserSessionInfo(userId: string): UserSession | null {
    return userSessions.get(userId) || null;
  }

  storeUserData(userId: string, analysis: AnalysisResult): void {
    userData.set(userId, analysis);
    
    // Update session with swimmer name
    const session = userSessions.get(userId);
    if (session) {
      session.swimmerName = analysis.swimmer.name;
      userSessions.set(userId, session);
    }
  }

  getUserData(userId: string): AnalysisResult | null {
    return userData.get(userId) || null;
  }

  clearUserData(userId: string): void {
    userSessions.delete(userId);
    userData.delete(userId);
  }

  getActiveUsersCount(): number {
    return userSessions.size;
  }

  getTotalSessionsCount(): number {
    return userSessions.size;
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const userService = new UserService(); 