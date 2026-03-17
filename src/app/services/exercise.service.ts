import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Exercise } from '../models/exercise';
import { Statistics } from '../models/statistics';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {
  private exercisesSubject = new BehaviorSubject<Exercise[]>(this.loadExercises());
  private statisticsSubject = new BehaviorSubject<Statistics>(this.calculateStatistics());

  exercises$ = this.exercisesSubject.asObservable();
  statistics$ = this.statisticsSubject.asObservable();

  private readonly STORAGE_KEY = 'angular-practice-exercises';

  constructor() {
    this.initializeDefaultExercises();
  }

  private loadExercises(): Exercise[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      const exercises = JSON.parse(stored);
      // Convert date strings back to Date objects
      return exercises.map((ex: any) => ({
        ...ex,
        createdDate: new Date(ex.createdDate),
        completedDate: ex.completedDate ? new Date(ex.completedDate) : undefined
      }));
    }
    return [];
  }

  private saveExercises(exercises: Exercise[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(exercises));
    this.exercisesSubject.next(exercises);
    this.updateStatistics();
  }

  private initializeDefaultExercises(): void {
    const exercises = this.exercisesSubject.value;
    if (exercises.length === 0) {
      const defaultExercises: Exercise[] = [
        {
          id: 'unit-converter',
          title: 'Unit Converter',
          description: 'Chuyển đổi giữa các đơn vị đo lường khác nhau',
          difficulty: 'Easy',
          category: 'Forms & User Input',
          tags: ['forms', 'reactive-forms', 'conversion'],
          route: '/exercises/unit-converter',
          createdDate: new Date(),
          completed: false
        }
      ];
      this.saveExercises(defaultExercises);
    }
  }

  private calculateStatistics(): Statistics {
    const exercises = this.exercisesSubject.value;
    const completed = exercises.filter(ex => ex.completed);

    return {
      totalProblems: exercises.length,
      completedProblems: completed.length,
      completionRate: exercises.length > 0 ? (completed.length / exercises.length) * 100 : 0,
      averageTimePerProblem: this.calculateAverageTime(completed),
      totalTimeSpent: completed.reduce((sum, ex) => sum + (ex.timeSpent || 0), 0),
      easyCompleted: completed.filter(ex => ex.difficulty === 'Easy').length,
      mediumCompleted: completed.filter(ex => ex.difficulty === 'Medium').length,
      hardCompleted: completed.filter(ex => ex.difficulty === 'Hard').length,
      categoriesStats: this.calculateCategoryStats(exercises),
      recentActivity: [],
      streak: 0,
      bestStreak: 0
    };
  }

  private calculateAverageTime(exercises: Exercise[]): number {
    if (exercises.length === 0) return 0;
    const totalTime = exercises.reduce((sum, ex) => sum + (ex.timeSpent || 0), 0);
    return totalTime / exercises.length;
  }

  private calculateCategoryStats(exercises: Exercise[]): any[] {
    const categories = [...new Set(exercises.map(ex => ex.category))];
    return categories.map(category => {
      const categoryExercises = exercises.filter(ex => ex.category === category);
      const completedCategory = categoryExercises.filter(ex => ex.completed);
      return {
        category,
        total: categoryExercises.length,
        completed: completedCategory.length,
        completionRate: categoryExercises.length > 0 ? 
          (completedCategory.length / categoryExercises.length) * 100 : 0
      };
    });
  }

  private updateStatistics(): void {
    const stats = this.calculateStatistics();
    this.statisticsSubject.next(stats);
  }

  // Public methods
  getExercises(): Observable<Exercise[]> {
    return this.exercises$;
  }

  getStatistics(): Observable<Statistics> {
    return this.statistics$;
  }

  getExerciseById(id: string): Exercise | undefined {
    return this.exercisesSubject.value.find(ex => ex.id === id);
  }

  addExercise(exercise: Exercise): void {
    const exercises = [...this.exercisesSubject.value, exercise];
    this.saveExercises(exercises);
  }

  updateExercise(id: string, updates: Partial<Exercise>): void {
    const exercises = this.exercisesSubject.value.map(ex =>
      ex.id === id ? { ...ex, ...updates } : ex
    );
    this.saveExercises(exercises);
  }

  markAsCompleted(id: string, timeSpent?: number): void {
    this.updateExercise(id, {
      completed: true,
      completedDate: new Date(),
      timeSpent
    });
  }

  deleteExercise(id: string): void {
    const exercises = this.exercisesSubject.value.filter(ex => ex.id !== id);
    this.saveExercises(exercises);
  }

  getRecentExercises(count: number = 5): Exercise[] {
    return [...this.exercisesSubject.value]
      .sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime())
      .slice(0, count);
  }

  getExercisesByCategory(category: string): Exercise[] {
    return this.exercisesSubject.value.filter(ex => ex.category === category);
  }

  searchExercises(query: string): Exercise[] {
    const lowerQuery = query.toLowerCase();
    return this.exercisesSubject.value.filter(ex =>
      ex.title.toLowerCase().includes(lowerQuery) ||
      ex.description.toLowerCase().includes(lowerQuery) ||
      ex.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
}
