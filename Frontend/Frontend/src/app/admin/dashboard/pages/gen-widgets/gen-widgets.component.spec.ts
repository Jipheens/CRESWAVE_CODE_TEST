import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenWidgetsComponent } from './gen-widgets.component';

describe('GenWidgetsComponent', () => {
  let component: GenWidgetsComponent;
  let fixture: ComponentFixture<GenWidgetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenWidgetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenWidgetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
