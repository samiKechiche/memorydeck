import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PracticeSessionService, PracticeSession } from '../services/practice-session';
import { CardService, Card } from '../../decks/services/card';
import { DeckService } from '../../decks/services/deck';

@Component({
  selector: 'app-practice-session',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './practice-session.html',
  styleUrl: './practice-session.css'
})
export class PracticeSessionComponent implements OnInit {

  sessionId!: number;
  session!: PracticeSession;

  cards: Card[] = [];
  currentIndex = 0;
  showBack = false;

  deckName = '';
  sessionStart = '';

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private practiceService: PracticeSessionService,
    private cardService: CardService,
    private deckService: DeckService
  ) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.sessionId = Number(this.route.snapshot.paramMap.get('sessionId'));
    this.loadSession();
  }

  loadSession() {
    const userId = Number(localStorage.getItem('userId'));

    this.practiceService.getUserSessions(userId).subscribe({
      next: sessions => {
        const found = sessions.find(s => s.id === this.sessionId);
        if (!found) {
          alert('Practice session not found');
          this.router.navigate(['/decks']);
          return;
        }

        this.session = found;
        this.sessionStart = found.startedAt;

        this.deckService.getDeckById(found.deckId).subscribe({
          next: deck => this.deckName = deck.name,
          error: () => this.deckName = 'Unknown deck'
        });

        this.loadCards();
      },
      error: () => alert('Failed to load session')
    });
  }

  loadCards() {
    this.cardService.getCardsByDeck(this.session.deckId).subscribe({
      next: cards => {
        this.cards = cards;
        this.currentIndex = 0;
        this.showBack = false;
        this.loading = false;
      },
      error: () => alert('Failed to load cards')
    });
  }

  answer(type: 'correct' | 'incorrect' | 'skipped') {
    this.practiceService.increment(
      this.sessionId,
      type === 'correct' ? 1 : 0,
      type === 'incorrect' ? 1 : 0,
      type === 'skipped' ? 1 : 0
    ).subscribe(() => {
      this.showBack = false;
      this.currentIndex++;

      if (this.currentIndex >= this.cards.length) {
        this.endSession();
      }
    });
  }

  endSession() {
    this.practiceService.endSession(this.sessionId).subscribe({
      next: () => {
        this.router.navigate(['/practice', this.sessionId, 'summary']);
      },
      error: () => alert('Failed to end session')
    });
  }

  endSessionEarly() {
    if (!confirm('End practice session early?')) return;

    this.practiceService.endSession(this.sessionId).subscribe({
      next: () => {
        this.router.navigate(['/practice', this.sessionId, 'summary']);
      },
      error: () => alert('Failed to end session')
    });
  }

  get currentCard(): Card | null {
    return this.cards[this.currentIndex] ?? null;
  }
}
