import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

export interface PracticeSession {
  id: number;
  userId: number;
  deckId: number;
  startedAt: string;
  endedAt: string | null;
  durationMinutes: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class PracticeSessionService {

  private apiUrl = `${environment.apiUrl}/PracticeSession`;

  constructor(private http: HttpClient) {}

  startSession(userId: number, deckId: number): Observable<PracticeSession> {
    return this.http.post<PracticeSession>(`${this.apiUrl}/start`, {
      userId,
      deckId
    });
  }

  increment(
    sessionId: number,
    correct = 0,
    incorrect = 0,
    skipped = 0
  ) {
    return this.http.put(`${this.apiUrl}/${sessionId}`, {
      correctDelta: correct,
      incorrectDelta: incorrect,
      skippedDelta: skipped
    });
  }

  endSession(sessionId: number): Observable<PracticeSession> {
    return this.http.put<PracticeSession>(`${this.apiUrl}/${sessionId}/end`, {});
  }

  getUserSessions(userId: number): Observable<PracticeSession[]> {
    return this.http.get<PracticeSession[]>(`${this.apiUrl}/user/${userId}`);
  }

  getSummary(sessionId: number) {
    return this.http.get(`${this.apiUrl}/${sessionId}/summary`);
  }

  deleteSession(sessionId: number) {
    return this.http.delete(`${this.apiUrl}/${sessionId}`);
  }

  deleteAllUserSessions(userId: number) {
    return this.http.delete(`${this.apiUrl}/user/${userId}`);
  }
}
