// TypeScript interfaces corresponding to Python data models

export interface SwimmerInfo {
  name: string;
  age: number;
  team: string;
}

export interface MeetInfo {
  name: string;
  date: string;
  location: string;
  courseType: string; // "SCY", "SCM", or "LCM"
}

export interface SwimResult {
  event: string;
  time: string;
  place: number;
  date: string;
  club: string;
  ageGroup: string;
  courseType: string; // "SCY", "SCM", or "LCM"
}

export interface BestTime {
  event: string;
  time: string;
  date: string;
  meet: string;
  seconds: number;
  courseType: string; // "SCY", "SCM", or "LCM"
}

export interface PerformanceTrend {
  event: string;
  times: number[];
}

export interface MeetResult {
  event: string;
  place: number;
  time: string;
  improvement: string;
  ageGroup: string;
}

export interface Improvement {
  event: string;
  improvement: string;
  date: string;
}

export interface AgeGroupImprovement {
  event: string;
  improvement: string;
  rank: number;
}

export interface ClubInfo {
  name: string;
  location: string;
  years: string;
  meets: number;
  events: number;
  bestTimes: number;
  logo: string;
}

export interface PerformanceInsights {
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

export interface PerformanceSummary {
  totalEvents: number;
  totalPoints: number;
  averagePlace: number;
}

export interface SwimmerPerformance {
  name: string;
  age: number;
  totalMeets: number;
  totalEvents: number;
}

export interface PerformanceData {
  bestTimes: BestTime[];
  recentTimes: PerformanceTrend[];
}

export interface MeetData {
  name: string;
  date: string;
  location: string;
  results: MeetResult[];
}

export interface MeetBreakdown {
  meets: MeetData[];
  currentMeet: Record<string, any>; // Keep for backward compatibility
  allTimeImprovements: Improvement[];
  ageGroupImprovements: Record<string, AgeGroupImprovement[]>;
}

export interface PersonalBests {
  allTime: BestTime[];
  byAgeGroup: Record<string, BestTime[]>;
}

export interface AnalysisResult {
  swimmer: SwimmerPerformance;
  performance: PerformanceData;
  meetBreakdown: MeetBreakdown;
  personalBests: PersonalBests;
  clubs: ClubInfo[];
  summary: PerformanceSummary;
  insights: PerformanceInsights;
  eventDistribution: Record<string, number>;
}

export interface UserSession {
  userId: string;
  swimmerName: string;
}

export interface ScrapedData {
  swimmer: SwimmerInfo;
  meet: MeetInfo;
  results: SwimResult[];
}

// API Request/Response interfaces
export interface AnalyzeRequest {
  usmsLink: string;
}

export interface AnalyzeResponse {
  swimmer: {
    name: string;
    age: number;
    totalMeets: number;
    totalEvents: number;
  };
  performance: {
    bestTimes: Array<{
      event: string;
      time: string;
      date: string;
      meet: string;
      courseType: string;
    }>;
    recentTimes: Array<{
      event: string;
      times: number[];
    }>;
  };
  meetBreakdown: {
    meets: Array<{
      name: string;
      date: string;
      location: string;
      results: Array<{
        event: string;
        place: number;
        time: string;
        improvement: string;
        ageGroup: string;
      }>;
    }>;
    currentMeet: Record<string, any>;
    allTimeImprovements: Array<{
      event: string;
      improvement: string;
      date: string;
    }>;
    ageGroupImprovements: Record<string, Array<{
      event: string;
      improvement: string;
      rank: number;
    }>>;
  };
  personalBests: {
    allTime: Array<{
      event: string;
      time: string;
      date: string;
      meet: string;
      courseType: string;
    }>;
    byAgeGroup: Record<string, Array<{
      event: string;
      time: string;
      date: string;
      meet: string;
      courseType: string;
    }>>;
  };
  clubs: Array<{
    name: string;
    location: string;
    years: string;
    meets: number;
    events: number;
    bestTimes: number;
    logo: string;
  }>;
  summary: {
    totalEvents: number;
    totalPoints: number;
    averagePlace: number;
  };
  insights: {
    strengths: string[];
    improvements: string[];
    recommendations: string[];
  };
  eventDistribution: Record<string, number>;
  userSession?: {
    userId: string;
    swimmerName: string;
  };
}

export interface SessionResponse {
  userId: string;
  hasData: boolean;
  swimmerName: string | null;
  newSession: boolean;
}

export interface CreateSessionResponse {
  userId: string;
  message: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
}

export interface ActiveUsersResponse {
  activeUsers: number;
  totalSessions: number;
}

export interface ErrorResponse {
  error: string;
} 