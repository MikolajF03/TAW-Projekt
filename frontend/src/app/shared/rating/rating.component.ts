import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingService } from '../../services/rating.service';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {
  @Input() postId!: string;
  @Input() readonly: boolean = false;

  stars: number[] = [1, 2, 3, 4, 5];
  hoverRating: number = 0;
  averageRating: number = 0;
  votesCount: number = 0;

  constructor(private ratingService: RatingService) {}

  ngOnInit(): void {
    this.loadRatingData();
  }

  loadRatingData(): void {
    const data = this.ratingService.getPostData(this.postId);
    this.averageRating = data.averageRating;
    this.votesCount = data.votesCount;
  }

  onStarHover(rating: number): void {
    if (!this.readonly) this.hoverRating = rating;
  }

  onStarClick(rating: number): void {
    if (!this.readonly) {
      this.ratingService.addVote(this.postId, rating);
      this.loadRatingData();
    }
  }
}