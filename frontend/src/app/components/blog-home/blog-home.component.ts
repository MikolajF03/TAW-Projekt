import { Component, ViewChild, OnInit } from '@angular/core';
import { SearchBarComponent } from "../../shared/search-bar/search-bar.component";
import { BlogComponent } from "../blog/blog.component";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-blog-home',
  standalone: true,
  imports: [SearchBarComponent, BlogComponent],
  templateUrl: './blog-home.component.html',
  styleUrl: './blog-home.component.scss'
})
export class BlogHomeComponent implements OnInit {
  public filterText: string = '';
  public currentPage: number = 1;
  public currentSort: string = 'newest';

  @ViewChild(BlogComponent) blogComponent!: BlogComponent;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentPage = +params['page'] || 1;
      this.currentSort = params['sort'] || 'newest';
    });
  }

  getName($event: string): void {
    if (this.filterText !== $event) {
      this.filterText = $event;
      this.onPageChange(1); 
    }
  }

  onPageChange(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page, sort: this.currentSort },
      queryParamsHandling: 'merge'
    });
  }

  refreshPosts(): void {
    this.blogComponent.getAll();
    this.filterText = '';
    this.onPageChange(1);
  }

  onSortChange(event: any) {
    this.currentSort = event.target.value;
    this.blogComponent.sortItems(this.currentSort, true);
  }
}