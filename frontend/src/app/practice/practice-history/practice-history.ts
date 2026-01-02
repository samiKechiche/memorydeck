import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PracticeSessionService, PracticeSession } from '../services/practice-session';
import { DeckService } from '../../decks/services/deck';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-practice-history',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './practice-history.html',
  styleUrl: './practice-history.css'
})
export class PracticeHistoryComponent implements OnInit {

  sessions: PracticeSession[] = [];
  loading = true;
  deckNames: Record<number, string> = {};
  sortOrder: 'newest' | 'oldest' = 'newest';
  selectedDeckId: number | 'all' = 'all';
  deckIds: number[] = [];


  constructor(
    private practiceService: PracticeSessionService,
    private deckService: DeckService,
    private router: Router
  ) {}

  ngOnInit() {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.practiceService.getUserSessions(userId).subscribe({
      next: sessions => {
        this.sessions = sessions.filter(s => s.endedAt !== null);
        this.loadDeckNames();
        this.loading = false;
      },
      error: () => alert('Failed to load practice history')
    });
  }

loadDeckNames() {
  const ids = [...new Set(this.sessions.map(s => s.deckId))];
  this.deckIds = ids;

  ids.forEach(deckId => {
    this.deckService.getDeckById(deckId).subscribe({
      next: deck => this.deckNames[deckId] = deck.name,
      error: () => this.deckNames[deckId] = 'Unknown deck'
    });
  });
}


  viewSummary(sessionId: number) {
    this.router.navigate(['/practice', sessionId, 'summary']);
  }

  deleteSession(sessionId: number) {
    if (!confirm('Delete this session?')) return;

    this.practiceService.deleteSession(sessionId).subscribe(() => {
      this.sessions = this.sessions.filter(s => s.id !== sessionId);
    });
  }

  deleteAll() {
    const userId = Number(localStorage.getItem('userId'));
    if (!confirm('Delete ALL practice history?')) return;

    this.practiceService.deleteAllUserSessions(userId).subscribe(() => {
      this.sessions = [];
    });
  }

  get filteredAndSortedSessions() {
  let result = [...this.sessions];

// Filter by deck
if (this.selectedDeckId !== 'all') {
  const deckId = Number(this.selectedDeckId);
  result = result.filter(s => s.deckId === deckId);
}


  // Sort
  result.sort((a, b) => {
    const aTime = new Date(a.startedAt).getTime();
    const bTime = new Date(b.startedAt).getTime();

    return this.sortOrder === 'newest'
      ? bTime - aTime
      : aTime - bTime;
  });

  return result;
}


  formatDuration(minutes: number): string {
  const totalSeconds = Math.round(minutes * 60);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;

  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

}
