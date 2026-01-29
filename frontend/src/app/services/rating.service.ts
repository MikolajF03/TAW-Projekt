import { Injectable } from '@angular/core';

interface PostRating {
  votes: number[];
}

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private storageKey = 'blog_ratings';

  private getRatings(): Record<string, PostRating> {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : {};
  }

  getPostData(postId: string) {
    const ratings = this.getRatings();
    const postData = ratings[postId] || { votes: [] };
    const votesCount = postData.votes.length;
    const averageRating = votesCount > 0 
      ? postData.votes.reduce((a, b) => a + b, 0) / votesCount 
      : 0;

    return { averageRating, votesCount };
  }

  addVote(postId: string, rating: number): void {
    const ratings = this.getRatings();
    if (!ratings[postId]) {
      ratings[postId] = { votes: [] };
    }
    ratings[postId].votes.push(rating);
    localStorage.setItem(this.storageKey, JSON.stringify(ratings));
  }
}