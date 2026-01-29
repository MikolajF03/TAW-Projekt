import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'blog-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog-gallery-component.component.html',
  styleUrl: './blog-gallery-component.component.scss'
})
export class BlogGalleryComponent implements OnInit {
  public images: string[] = [];
  public selectedImage: string | null = null;

  constructor(private service: DataService) { }

  ngOnInit() {

  this.service.getAll().subscribe((posts: any) => {
    if (posts) {
      this.images = posts.map((p: any) => p.image);
    }
  });
  }

  openImage(img: string) {
    this.selectedImage = img;
  }

  closeImage() {
    this.selectedImage = null;
  }
}