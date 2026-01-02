import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PracticeSessionService } from '../services/practice-session';

@Component({
  selector: 'app-practice-summary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './practice-summary.html',
  styleUrl: './practice-summary.css'
})
export class PracticeSummaryComponent implements OnInit {

  sessionId!: number;
  summary: any;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private practiceService: PracticeSessionService
  ) {}

  ngOnInit() {
    this.sessionId = Number(this.route.snapshot.paramMap.get('sessionId'));
    this.loadSummary();
  }

  loadSummary() {
    this.practiceService.getSummary(this.sessionId).subscribe({
      next: data => {
        this.summary = data;
        this.loading = false;
      },
      error: () => {
        alert('Failed to load summary');
        this.router.navigate(['/decks']);
      }
    });
  }

  formatDuration(minutes: number): string {
  const totalSeconds = Math.round(minutes * 60);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

}
