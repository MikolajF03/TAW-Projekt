import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="themeService.toggleTheme()" class="btn btn-outline-secondary rounded-pill px-3 shadow-sm">
      <i class="fa" [ngClass]="(themeService.darkMode$ | async) ? 'fa-sun-o text-warning' : 'fa-moon-o'"></i>
      <span class="ms-2">{{ (themeService.darkMode$ | async) ? 'Jasny' : 'Ciemny' }}</span>
    </button>
  `
})
export class ThemeToggleComponent {
  constructor(public themeService: ThemeService) {}
}