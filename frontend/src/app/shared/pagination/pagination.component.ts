import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" [class.disabled]="currentPage <= 1">
          <button class="page-link" (click)="selectPage(currentPage - 1)" type="button">Poprzednia</button>
        </li>
        
        @for (p of pages; track p) {
          <li class="page-item" [class.active]="currentPage === p">
            <button class="page-link" (click)="selectPage(p)" type="button">{{ p }}</button>
          </li>
        }

        <li class="page-item" [class.disabled]="currentPage >= totalPages">
          <button class="page-link" (click)="selectPage(currentPage + 1)" type="button">Następna</button>
        </li>
      </ul>
    </nav>
  `
})
export class PaginationComponent {
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 1;
  @Input() currentPage: number = 1;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage) || 1;
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  selectPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      console.log('Kliknięto stronę:', page);
      this.pageChange.emit(page);
    }
  }
}