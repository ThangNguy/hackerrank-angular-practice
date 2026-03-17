export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  tags: string[];
  timeComplexity?: string;
  spaceComplexity?: string;
  solution?: string;
  testCases: TestCase[];
  completed: boolean;
  timeSpent?: number; // in minutes
  attempts: number;
  lastAttempt?: Date;
  rating?: number;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}

export interface ProblemCategory {
  name: string;
  icon: string;
  count: number;
  color: string;
}
