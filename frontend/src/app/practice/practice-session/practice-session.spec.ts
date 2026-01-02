import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeSession } from './practice-session';

describe('PracticeSession', () => {
  let component: PracticeSession;
  let fixture: ComponentFixture<PracticeSession>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeSession]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeSession);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
