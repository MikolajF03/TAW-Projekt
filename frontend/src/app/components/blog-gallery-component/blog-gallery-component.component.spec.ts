import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogGalleryComponentComponent } from './blog-gallery-component.component';

describe('BlogGalleryComponentComponent', () => {
  let component: BlogGalleryComponentComponent;
  let fixture: ComponentFixture<BlogGalleryComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogGalleryComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogGalleryComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
