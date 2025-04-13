import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetsStoriesComponent } from './pets-stories.component';

describe('PetsStoriesComponent', () => {
  let component: PetsStoriesComponent;
  let fixture: ComponentFixture<PetsStoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetsStoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetsStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
