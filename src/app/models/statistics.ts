export interface Statistics {
  totalProblems: number;
  completedProblems: number;
  completionRate: number;
  averageTimePerProblem: number;
  totalTimeSpent: number;
  easyCompleted: number;
  mediumCompleted: number;
  hardCompleted: number;
  categoriesStats: CategoryStats[];
  recentActivity: ActivityLog[];
  streak: number;
  bestStreak: number;
}

export interface CategoryStats {
  category: string;
  total: number;
  completed: number;
  completionRate: number;
}

export interface ActivityLog {
  date: Date;
  problemId: string;
  problemTitle: string;
  action: 'completed' | 'attempted' | 'reviewed';
  timeSpent?: number;
}
