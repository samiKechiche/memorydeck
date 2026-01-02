import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeSummary } from './practice-summary';

describe('PracticeSummary', () => {
  let component: PracticeSummary;
  let fixture: ComponentFixture<PracticeSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticeSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
