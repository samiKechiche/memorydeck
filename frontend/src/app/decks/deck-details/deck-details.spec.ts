import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeckDetails } from './deck-details';

describe('DeckDetails', () => {
  let component: DeckDetails;
  let fixture: ComponentFixture<DeckDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeckDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeckDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
