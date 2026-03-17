export interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  tags: string[];
  route: string; // Route to the exercise component
  createdDate: Date;
  completedDate?: Date;
  completed: boolean;
  timeSpent?: number; // in minutes
  notes?: string;
}

export interface ExerciseCategory {
  name: string;
  icon: string;
  count: number;
  color: string;
}
