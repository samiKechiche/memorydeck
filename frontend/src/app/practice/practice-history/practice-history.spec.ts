import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeHistory } from './practice-history';

describe('PracticeHistory', () => {
  let component: PracticeHistory;
  let fixture: ComponentFixture<PracticeHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
