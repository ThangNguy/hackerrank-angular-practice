import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProblemService } from '../../services/problem.service';
import { Problem, ProblemCategory } from '../../models/problem';

@Component({
  selector: 'app-problem-list',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './problem-list.component.html',
  styleUrl: './problem-list.component.scss'
})
export class ProblemListComponent implements OnInit {
  problems$: Observable<Problem[]>;
  filteredProblems$: Observable<Problem[]>;
  categories: ProblemCategory[] = [];

  searchTerm$ = new BehaviorSubject<string>('');
  selectedCategory$ = new BehaviorSubject<string>('');
  selectedDifficulty$ = new BehaviorSubject<string>('');
  showCompletedOnly$ = new BehaviorSubject<boolean>(false);

  searchTerm = '';
  selectedCategory = '';
  selectedDifficulty = '';
  showCompletedOnly = false;

  constructor(
    private problemService: ProblemService,
    private route: ActivatedRoute
  ) {
    this.problems$ = this.problemService.getProblems();

    // Setup filtered problems observable
    this.filteredProblems$ = combineLatest([
      this.problems$,
      this.searchTerm$,
      this.selectedCategory$,
      this.selectedDifficulty$,
      this.showCompletedOnly$
    ]).pipe(
      map(([problems, search, category, difficulty, completedOnly]) =>
        problems.filter(problem => {
          const matchesSearch = problem.title.toLowerCase().includes(search.toLowerCase()) ||
                              problem.description.toLowerCase().includes(search.toLowerCase());
          const matchesCategory = !category || problem.category === category;
          const matchesDifficulty = !difficulty || problem.difficulty === difficulty;
          const matchesCompleted = !completedOnly || problem.completed;

          return matchesSearch && matchesCategory && matchesDifficulty && matchesCompleted;
        })
      )
    );
  }

  ngOnInit(): void {
    this.categories = this.problemService.getCategories();

    // Handle query parameters
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
        this.selectedCategory$.next(this.selectedCategory);
      }
      if (params['difficulty']) {
        this.selectedDifficulty = params['difficulty'];
        this.selectedDifficulty$.next(this.selectedDifficulty);
      }
    });
  }

  onSearchChange(): void {
    this.searchTerm$.next(this.searchTerm);
  }

  onCategoryChange(): void {
    this.selectedCategory$.next(this.selectedCategory);
  }

  onDifficultyChange(): void {
    this.selectedDifficulty$.next(this.selectedDifficulty);
  }

  onCompletedOnlyChange(): void {
    this.showCompletedOnly$.next(this.showCompletedOnly);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.selectedDifficulty = '';
    this.showCompletedOnly = false;

    this.searchTerm$.next('');
    this.selectedCategory$.next('');
    this.selectedDifficulty$.next('');
    this.showCompletedOnly$.next(false);
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'Easy': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Hard': return '#EF4444';
      default: return '#6B7280';
    }
  }

  markAsCompleted(problem: Problem, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.problemService.markAsCompleted(problem.id);
  }
}
