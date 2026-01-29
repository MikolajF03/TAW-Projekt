import { Component, Input } from '@angular/core';
import { SummaryPipe } from '../../pipes/summary.pipe';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'blog-item-text',
  standalone: true,
  imports: [SummaryPipe, CommonModule, RouterModule],
  templateUrl: './blog-item-text.component.html',
  styleUrl: './blog-item-text.component.scss'
})
export class BlogItemTextComponent {
  @Input() title?: string;
  @Input() text?: string;
  @Input() id?: any;

  constructor(public favoritesService: FavoritesService) {}

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    
    if (this.id) {
      this.favoritesService.toggleFavorite(this.id);
    }
  }
}