import { Routes } from '@angular/router';
import { Login } from './auth/auth/login/login';
import { Register } from './auth/auth/register/register';
import { DeckList } from './decks/deck-list/deck-list';
import { DeckDetails } from './decks/deck-details/deck-details';
import { PracticeSessionComponent } from './practice/practice-session/practice-session';
import { PracticeSummaryComponent } from './practice/practice-summary/practice-summary';
import { PracticeHistoryComponent } from './practice/practice-history/practice-history';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'decks', component: DeckList },
  { path: 'decks/:deckId', component: DeckDetails },
  { path: 'practice/:sessionId', component: PracticeSessionComponent },
  { path: 'practice/:sessionId/summary', component: PracticeSummaryComponent },
  { path: 'practice-history', component: PracticeHistoryComponent }
];
