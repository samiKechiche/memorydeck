import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DeckService } from '../services/deck';
import { CardService, Card } from '../services/card';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-deck-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './deck-details.html',
  styleUrl: './deck-details.css'
})
export class DeckDetails implements OnInit {

  deckId!: number;
  deck: any;

  cards: Card[] = [];

  newFront = '';
  newBack = '';

  editingCardId: number | null = null;
  editFront = '';
  editBack = '';
  editingName = false;
  newDeckName = '';


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private deckService: DeckService,
    private cardService: CardService
  ) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.deckId = Number(this.route.snapshot.paramMap.get('deckId'));
    this.loadDeck();
    this.loadCards();
  }

  loadDeck() {
    this.deckService.getDeckById(this.deckId).subscribe({
      next: data => this.deck = data,
      error: () => console.error('Failed to load deck')
    });
  }

  loadCards() {
    this.cardService.getCardsByDeck(this.deckId).subscribe({
      next: data => this.cards = data,
      error: () => console.error('Failed to load cards')
    });
  }

  createCard() {
    if (!this.newFront.trim() || !this.newBack.trim()) return;

    this.cardService.createCard(this.deckId, this.newFront, this.newBack).subscribe({
      next: () => {
        this.newFront = '';
        this.newBack = '';
        this.loadCards();
        this.loadDeck(); 
      },
      error: () => console.error('Failed to create card')
    });
  }

  startEdit(card: Card) {
    this.editingCardId = card.id;
    this.editFront = card.frontText;
    this.editBack = card.backText;
  }

  cancelEdit() {
    this.editingCardId = null;
  }

  saveEdit(cardId: number) {
    if (!this.editFront.trim() || !this.editBack.trim()) return;

    this.cardService.updateCard(cardId, this.editFront, this.editBack).subscribe({
      next: () => {
        this.editingCardId = null;
        this.loadCards();
        this.loadDeck(); 
      },
      error: () => console.error('Failed to update card')
    });
  }

deleteCard(cardId: number) {
  if (!confirm('Delete this card?')) return;

  this.cardService.deleteCard(cardId).subscribe({
    next: () => {
      this.loadCards();
      this.loadDeck(); 
    },
    error: () => console.error('Failed to delete card')
  });
}



moveUp(card: Card) {
  if (card.order === 1) return;

  this.cardService.reorderCard(card.id, card.order - 1).subscribe({
    next: () => {
      this.loadCards();
      this.loadDeck(); 
    },
    error: () => console.error('Failed to reorder card')
  });
}

moveDown(card: Card) {
  if (card.order === this.cards.length) return;

  this.cardService.reorderCard(card.id, card.order + 1).subscribe({
    next: () => {
      this.loadCards();
      this.loadDeck(); 
    },
    error: () => console.error('Failed to reorder card')
  });
}


  startRename() {
  this.editingName = true;
  this.newDeckName = this.deck.name;
}

cancelRename() {
  this.editingName = false;
}

saveRename() {
  if (!this.newDeckName.trim()) return;

  this.deckService.updateDeck(this.deckId, this.newDeckName).subscribe({
    next: () => {
      this.editingName = false;
      this.loadDeck(); 
    },
    error: () => console.error('Failed to rename deck')
  });
}

}
