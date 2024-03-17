import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBlogDialogComponent } from './add-blog-dialog.component';

describe('AddBlogDialogComponent', () => {
  let component: AddBlogDialogComponent;
  let fixture: ComponentFixture<AddBlogDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBlogDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBlogDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
