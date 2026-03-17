import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { ExerciseService } from '../../services/exercise.service';
import { Statistics } from '../../models/statistics';
import { Exercise } from '../../models/exercise';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  statistics$: Observable<Statistics>;
  exercises$: Observable<Exercise[]>;
  recentExercises: Exercise[] = [];
  allExercises: Exercise[] = [];

  constructor(private exerciseService: ExerciseService) {
    this.statistics$ = this.exerciseService.getStatistics();
    this.exercises$ = this.exerciseService.getExercises();
  }

  ngOnInit(): void {
    this.exercises$.subscribe(exercises => {
      this.allExercises = exercises;
      this.recentExercises = this.exerciseService.getRecentExercises(3);
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

  getDifficultyBadgeClass(difficulty: string): string {
    return difficulty.toLowerCase();
  }
}
