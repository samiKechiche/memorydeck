import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Card {
  id: number;
  frontText: string;
  backText: string;
  order: number;
  deckId: number;
}

@Injectable({
  providedIn: 'root'
})
export class CardService {

  private apiUrl = `${environment.apiUrl}/card`;

  constructor(private http: HttpClient) {}

  getCardsByDeck(deckId: number): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.apiUrl}/deck/${deckId}`);
  }

  createCard(deckId: number, frontText: string, backText: string): Observable<Card> {
    return this.http.post<Card>(this.apiUrl, {
      deckId,
      frontText,
      backText
    });
  }

  updateCard(cardId: number, frontText: string, backText: string) {
    return this.http.put(`${this.apiUrl}/${cardId}`, {
      frontText,
      backText
    });
  }

  deleteCard(cardId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cardId}`);
  }

  reorderCard(cardId: number, newOrder: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${cardId}/reorder`, {
      newOrder
    });
  }
}
