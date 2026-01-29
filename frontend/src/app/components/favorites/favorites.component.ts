import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { FavoritesService } from '../../services/favorites.service';
import { BlogItemComponent } from '../blog-item/blog-item.component';
import { PaginatePipe } from '../../pipes/paginate.pipe'; 
import { PaginationComponent } from "../../shared/pagination/pagination.component";

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, BlogItemComponent, PaginatePipe, PaginationComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  favoritesPosts: any[] = [];
  isLoading = true;

  currentPage = 1;
  itemsPerPage = 4;

  constructor(
    private dataService: DataService,
    private favService: FavoritesService
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    const favIds = this.favService.getFavorites();
    this.dataService.getAll().subscribe({
      next: (posts: any[]) => {
        this.favoritesPosts = posts.filter(post => favIds.includes(post._id));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Błąd pobierania:', err);
        this.isLoading = false;
      }
    });
  }


  onPageChanged(page: number) {
    this.currentPage = page;
    window.scrollTo(0, 0);
  }
}