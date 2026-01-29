import { Component, Input } from '@angular/core';

@Component({
  selector: 'blog-item-image',
  imports: [],
  standalone: true,
  templateUrl: './blog-item-image.component.html',
  styleUrl: './blog-item-image.component.scss'
})
export class BlogItemImageComponent {
  @Input() image?: string;
}