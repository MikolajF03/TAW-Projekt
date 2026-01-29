import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-like-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './like-button.component.html',
  styleUrl: './like-button.component.scss'
})
export class LikeButtonComponent {
  @Input() post: any;

  constructor(
    private service: DataService,
    private authService: AuthService
  ) {}

  toggleLike() {
    this.service.toggleLike(this.post._id).subscribe({
      next: (updatedPost: any) => {
        this.post.likes = updatedPost.likes;
      },
      error: (err) => {
        if (err.status === 401) alert('Zaloguj się, aby polubić post.');
      }
    });
  }

  isLiked(): boolean {
    const user = this.authService.currentUser;
    if (!user || !this.post?.likes) return false;
    const userId = user._id || user.id || user.userId;
    return this.post.likes.includes(String(userId));
  }
}