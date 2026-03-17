import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ProblemService } from '../../services/problem.service';
import { Problem } from '../../models/problem';

@Component({
  selector: 'app-problem-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './problem-detail.component.html',
  styleUrl: './problem-detail.component.scss'
})
export class ProblemDetailComponent implements OnInit {
  problem?: Problem;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private problemService: ProblemService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.problem = this.problemService.getProblemById(id);
      if (!this.problem) {
        this.router.navigate(['/problems']);
        return;
      }
      this.problemService.incrementAttempts(id);
    } else {
      this.router.navigate(['/problems']);
    }
    this.loading = false;
  }

  markAsCompleted(): void {
    if (this.problem) {
      this.problemService.markAsCompleted(this.problem.id, 30); // Default 30 minutes
      this.problem = { ...this.problem, completed: true };
    }
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
