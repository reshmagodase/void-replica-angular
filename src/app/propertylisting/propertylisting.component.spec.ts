import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertylistingComponent } from './propertylisting.component';

describe('PropertylistingComponent', () => {
  let component: PropertylistingComponent;
  let fixture: ComponentFixture<PropertylistingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertylistingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertylistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
