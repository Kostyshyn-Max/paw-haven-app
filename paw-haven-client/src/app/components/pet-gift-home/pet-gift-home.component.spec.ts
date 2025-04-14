import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetGiftHomeComponent } from './pet-gift-home.component';

describe('PetGiftHomeComponent', () => {
  let component: PetGiftHomeComponent;
  let fixture: ComponentFixture<PetGiftHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetGiftHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetGiftHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
