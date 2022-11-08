import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditmanagerComponent } from './editmanager.component';

describe('EditmanagerComponent', () => {
  let component: EditmanagerComponent;
  let fixture: ComponentFixture<EditmanagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditmanagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditmanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
