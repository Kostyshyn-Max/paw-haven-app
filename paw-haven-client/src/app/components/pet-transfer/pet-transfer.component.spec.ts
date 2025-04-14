import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetTransferComponent } from './pet-transfer.component';

describe('PetTransferComponent', () => {
  let component: PetTransferComponent;
  let fixture: ComponentFixture<PetTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetTransferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
