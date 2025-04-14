import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetRequestComponent } from './pet-request.component';

describe('PetRequestComponent', () => {
  let component: PetRequestComponent;
  let fixture: ComponentFixture<PetRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
