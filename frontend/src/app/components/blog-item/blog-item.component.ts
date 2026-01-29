import { Component, Input } from '@angular/core';
import { BlogItemImageComponent } from "../blog-item-image/blog-item-image.component";
import { BlogItemTextComponent } from "../blog-item-text/blog-item-text.component";
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../services/favorites.service';
import { RatingComponent } from '../../shared/rating/rating.component';
import { LikeButtonComponent } from '../like-button/like-button.component';

@Component({
    selector: 'blog-item',
    standalone: true,
    imports: [
        BlogItemImageComponent, 
        BlogItemTextComponent, 
        CommonModule, 
        RatingComponent,
        LikeButtonComponent
    ],
    templateUrl: './blog-item.component.html',
    styleUrl: './blog-item.component.scss'
})
export class BlogItemComponent {
    @Input() post: any;
    
    @Input() image?: string;
    @Input() title?: string;
    @Input() text?: string;
    @Input() id?: any;
    @Input() likes: string[] = [];

    constructor(public favoritesService: FavoritesService) {}

    toggleFavorite(event: Event) {
        event.stopPropagation();
        const currentId = this.post?._id || this.id;
        if (currentId) {
            this.favoritesService.toggleFavorite(currentId);
        }
    }
}