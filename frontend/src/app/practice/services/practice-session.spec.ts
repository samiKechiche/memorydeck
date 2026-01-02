import { TestBed } from '@angular/core/testing';

import { PracticeSession } from './practice-session';

describe('PracticeSession', () => {
  let service: PracticeSession;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PracticeSession);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
