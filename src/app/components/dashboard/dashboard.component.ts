import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ProblemService } from '../../services/problem.service';
import { Statistics, CategoryStats } from '../../models/statistics';
import { Problem, ProblemCategory } from '../../models/problem';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  statistics$: Observable<Statistics>;
  problems$: Observable<Problem[]>;
  categories: ProblemCategory[] = [];

  constructor(private problemService: ProblemService) {
    this.statistics$ = this.problemService.getStatistics();
    this.problems$ = this.problemService.getProblems();
  }

  ngOnInit(): void {
    this.categories = this.problemService.getCategories();

    // Update category counts based on actual problems
    this.problems$.subscribe(problems => {
      this.categories = this.categories.map(category => ({
        ...category,
        count: problems.filter(p => p.category === category.name).length
      }));
    });
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'Easy': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Hard': return '#EF4444';
      default: return '#6B7280';
    }
  }
}
