import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyeditComponent } from './propertyedit.component';

describe('PropertyeditComponent', () => {
  let component: PropertyeditComponent;
  let fixture: ComponentFixture<PropertyeditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertyeditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
