import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface Deck {
  id: number;
  name: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
}


@Injectable({
  providedIn: 'root'
})
export class DeckService {

  private apiUrl = `${environment.apiUrl}/deck`;

  constructor(private http: HttpClient) {}

  getUserDecks(userId: number): Observable<Deck[]> {
    return this.http.get<Deck[]>(`${this.apiUrl}/user/${userId}`);
  }

  getDeckById(deckId: number) {
  return this.http.get<any>(`${this.apiUrl}/${deckId}`);
}


  createDeck(userId: number, name: string): Observable<Deck> {
    return this.http.post<Deck>(this.apiUrl, {
      userId,
      name
    });
  }

  updateDeck(deckId: number, name: string) {
  return this.http.put(`${this.apiUrl}/${deckId}`, { name });
}


  deleteDeck(deckId: number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${deckId}`);
}

}
