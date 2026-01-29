import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from "../../services/data.service";
import { RatingService } from "../../services/rating.service";
import { BlogItemComponent } from '../blog-item/blog-item.component';
import { FilterTextPipe } from "../../pipes/filter-text.pipe";
import { PaginatePipe } from "../../pipes/paginate.pipe";
import { PaginationComponent } from "../../shared/pagination/pagination.component";

@Component({
  selector: 'blog',
  standalone: true,
  imports: [
    BlogItemComponent, 
    CommonModule, 
    FilterTextPipe, 
    PaginatePipe, 
    PaginationComponent
  ],
  providers: [DataService],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {
  @Input() filterText: string = '';
  @Input() public currentPage: number = 1;
  @Input() public itemsPerPage: number = 4; 

  @Output() pageChange = new EventEmitter<number>();

  public allItems: any[] = [];
  public isLoading: boolean = true;
  private currentSort: string = 'newest';

  constructor(
    private service: DataService,
    private ratingService: RatingService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.currentPage = +params['page'] || 1;
      this.currentSort = params['sort'] || 'newest';
      
      if (this.allItems.length === 0) {
        this.getAll();
      } else {
        this.sortItems(this.currentSort, false);
      }
    });
  }

  getAll() {
    this.isLoading = true;
    this.service.getAll().subscribe({
      next: (data) => {
        this.allItems = data.map((item: any) => {
          const ratingData = this.ratingService.getPostData(item._id);
          return {
            ...item,
            averageRating: ratingData.averageRating || 0
          };
        });
        
        this.sortItems(this.currentSort, false);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Błąd pobierania postów:', err);
        this.isLoading = false;
      }
    });
  }

  public sortItems(criteria: string, shouldResetPage: boolean = true) {
    this.currentSort = criteria;

    if (criteria === 'rating-desc') {
      this.allItems.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    } else if (criteria === 'rating-asc') {
      this.allItems.sort((a, b) => (a.averageRating || 0) - (b.averageRating || 0));
    } else if (criteria === 'newest') {
      this.allItems.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    this.allItems = [...this.allItems];

    if (shouldResetPage) {
      this.onPageChanged(1);
    }
  }

  onPageChanged(newPage: any) {
    this.currentPage = Number(newPage);
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { 
        page: this.currentPage,
        sort: this.currentSort 
      },
      queryParamsHandling: 'merge'
    });

    this.pageChange.emit(this.currentPage);
    window.scrollTo(0, 0);
  }
}