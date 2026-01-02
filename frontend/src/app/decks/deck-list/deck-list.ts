import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DeckService, Deck } from '../services/deck';
import { FormsModule } from '@angular/forms';
import { PracticeSessionService } from '../../practice/services/practice-session';

@Component({
  selector: 'app-deck-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './deck-list.html',
  styleUrl: './deck-list.css'
})
export class DeckList implements OnInit {

  username = localStorage.getItem('username');
  decks: Deck[] = [];
  newDeckName = '';
  sortField: 'createdAt' | 'updatedAt' = 'updatedAt';
  sortDirection: 'asc' | 'desc' = 'desc';
  searchTerm = '';


  constructor(
    private deckService: DeckService,
    private practiceService: PracticeSessionService,
    private router: Router
  ) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadDecks(Number(userId));
  }

  loadDecks(userId: number) {
    this.deckService.getUserDecks(userId).subscribe({
      next: data => this.decks = data,
      error: () => console.error('Failed to load decks')
    });
  }

  createDeck() {
    const userId = Number(localStorage.getItem('userId'));
    if (!this.newDeckName.trim()) return;

    this.deckService.createDeck(userId, this.newDeckName).subscribe({
      next: () => {
        this.newDeckName = '';
        this.loadDecks(userId);
      },
      error: () => console.error('Failed to create deck')
    });
  }

  openDeck(deckId: number) {
    this.router.navigate(['/decks', deckId]);
  }

  deleteDeck(deckId: number) {
    if (!confirm('Delete this deck?')) return;

    this.deckService.deleteDeck(deckId).subscribe({
      next: () => {
        const userId = Number(localStorage.getItem('userId'));
        this.loadDecks(userId);
      },
      error: () => console.error('Failed to delete deck')
    });
  }

  startPractice(deckId: number) {
    const userId = Number(localStorage.getItem('userId'));
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.practiceService.startSession(userId, deckId).subscribe({
      next: session => {
        this.router.navigate(['/practice', session.id]);
      },
      error: err => {
        if (err.status === 400) {
          this.practiceService.getUserSessions(userId).subscribe({
            next: sessions => {
              const active = sessions.find(
                s => s.deckId === deckId && s.endedAt === null
              );

              if (active) {
                this.router.navigate(['/practice', active.id]);
              } else {
                alert('Could not resume practice session');
              }
            }
          });
        } else {
          alert('Failed to start practice session');
        }
      }
    });
  }


get filteredAndSortedDecks(): Deck[] {
  let result = [...this.decks];

  // Search
  if (this.searchTerm.trim()) {
    const term = this.searchTerm.toLowerCase();
    result = result.filter(d =>
      d.name.toLowerCase().includes(term)
    );
  }

  // Sort (SAFE)
  result.sort((a, b) => {
    const aRaw = this.sortField === 'createdAt' ? a.createdAt : a.updatedAt;
    const bRaw = this.sortField === 'createdAt' ? b.createdAt : b.updatedAt;

    const aDate = aRaw ? new Date(aRaw).getTime() : 0;
    const bDate = bRaw ? new Date(bRaw).getTime() : 0;

    return this.sortDirection === 'asc'
      ? aDate - bDate
      : bDate - aDate;
  });

  return result;
}



  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  
}
