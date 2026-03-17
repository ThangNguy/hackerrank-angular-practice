import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Problem, ProblemCategory, TestCase } from '../models/problem';
import { Statistics, CategoryStats, ActivityLog } from '../models/statistics';

@Injectable({
  providedIn: 'root'
})
export class ProblemService {
  private problemsSubject = new BehaviorSubject<Problem[]>(this.loadProblems());
  private statisticsSubject = new BehaviorSubject<Statistics>(this.calculateStatistics());

  problems$ = this.problemsSubject.asObservable();
  statistics$ = this.statisticsSubject.asObservable();

  private readonly STORAGE_KEY = 'hackerrank-problems';
  private readonly STATS_KEY = 'hackerrank-stats';

  constructor() {
    this.initializeDefaultProblems();
  }

  private loadProblems(): Problem[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  private saveProblems(problems: Problem[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(problems));
    this.problemsSubject.next(problems);
    this.updateStatistics();
  }

  private calculateStatistics(): Statistics {
    const problems = this.problemsSubject.value;
    const completedProblems = problems.filter(p => p.completed);

    const stats: Statistics = {
      totalProblems: problems.length,
      completedProblems: completedProblems.length,
      completionRate: problems.length > 0 ? (completedProblems.length / problems.length) * 100 : 0,
      averageTimePerProblem: this.calculateAverageTime(completedProblems),
      totalTimeSpent: completedProblems.reduce((sum, p) => sum + (p.timeSpent || 0), 0),
      easyCompleted: completedProblems.filter(p => p.difficulty === 'Easy').length,
      mediumCompleted: completedProblems.filter(p => p.difficulty === 'Medium').length,
      hardCompleted: completedProblems.filter(p => p.difficulty === 'Hard').length,
      categoriesStats: this.calculateCategoryStats(problems),
      recentActivity: this.getRecentActivity(problems),
      streak: 0,
      bestStreak: 0
    };

    return stats;
  }

  private calculateAverageTime(problems: Problem[]): number {
    if (problems.length === 0) return 0;
    const totalTime = problems.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
    return totalTime / problems.length;
  }

  private calculateCategoryStats(problems: Problem[]): CategoryStats[] {
    const categories = [...new Set(problems.map(p => p.category))];
    return categories.map(category => {
      const categoryProblems = problems.filter(p => p.category === category);
      const completedCategory = categoryProblems.filter(p => p.completed);
      return {
        category,
        total: categoryProblems.length,
        completed: completedCategory.length,
        completionRate: categoryProblems.length > 0 ? (completedCategory.length / categoryProblems.length) * 100 : 0
      };
    });
  }

  private getRecentActivity(problems: Problem[]): ActivityLog[] {
    // Mock recent activity - in real app this would be stored
    return [];
  }

  private updateStatistics(): void {
    const stats = this.calculateStatistics();
    this.statisticsSubject.next(stats);
    localStorage.setItem(this.STATS_KEY, JSON.stringify(stats));
  }

  getProblems(): Observable<Problem[]> {
    return this.problems$;
  }

  getStatistics(): Observable<Statistics> {
    return this.statistics$;
  }

  getProblemById(id: string): Problem | undefined {
    return this.problemsSubject.value.find(p => p.id === id);
  }

  addProblem(problem: Problem): void {
    const problems = [...this.problemsSubject.value, problem];
    this.saveProblems(problems);
  }

  updateProblem(updatedProblem: Problem): void {
    const problems = this.problemsSubject.value.map(p =>
      p.id === updatedProblem.id ? updatedProblem : p
    );
    this.saveProblems(problems);
  }

  markAsCompleted(id: string, timeSpent: number = 0): void {
    const problems = this.problemsSubject.value.map(p =>
      p.id === id ? { ...p, completed: true, timeSpent, lastAttempt: new Date() } : p
    );
    this.saveProblems(problems);
  }

  incrementAttempts(id: string): void {
    const problems = this.problemsSubject.value.map(p =>
      p.id === id ? { ...p, attempts: p.attempts + 1, lastAttempt: new Date() } : p
    );
    this.saveProblems(problems);
  }

  getCategories(): ProblemCategory[] {
    return [
      { name: 'Arrays', icon: '🔢', count: 0, color: '#3B82F6' },
      { name: 'Strings', icon: '🔤', count: 0, color: '#10B981' },
      { name: 'Linked Lists', icon: '🔗', count: 0, color: '#F59E0B' },
      { name: 'Trees', icon: '🌳', count: 0, color: '#8B5CF6' },
      { name: 'Graphs', icon: '🕸️', count: 0, color: '#EF4444' },
      { name: 'Dynamic Programming', icon: '⚡', count: 0, color: '#06B6D4' },
      { name: 'Sorting', icon: '📊', count: 0, color: '#84CC16' },
      { name: 'Searching', icon: '🔍', count: 0, color: '#F97316' }
    ];
  }

  private initializeDefaultProblems(): void {
    if (this.problemsSubject.value.length === 0) {
      const defaultProblems: Problem[] = [
        {
          id: '1',
          title: 'Two Sum',
          description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
          difficulty: 'Easy',
          category: 'Arrays',
          tags: ['Array', 'Hash Table'],
          testCases: [
            { input: '[2,7,11,15], 9', expectedOutput: '[0,1]', description: 'Because nums[0] + nums[1] = 2 + 7 = 9' }
          ],
          completed: false,
          attempts: 0
        },
        {
          id: '2',
          title: 'Reverse String',
          description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
          difficulty: 'Easy',
          category: 'Strings',
          tags: ['String', 'Two Pointers'],
          testCases: [
            { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]' }
          ],
          completed: false,
          attempts: 0
        },
        {
          id: '3',
          title: 'Add Two Numbers',
          description: 'You are given two non-empty linked lists representing two non-negative integers.',
          difficulty: 'Medium',
          category: 'Linked Lists',
          tags: ['Linked List', 'Math'],
          testCases: [
            { input: '[2,4,3], [5,6,4]', expectedOutput: '[7,0,8]', description: '342 + 465 = 807' }
          ],
          completed: false,
          attempts: 0
        }
      ];
      this.saveProblems(defaultProblems);
    }
  }
}
