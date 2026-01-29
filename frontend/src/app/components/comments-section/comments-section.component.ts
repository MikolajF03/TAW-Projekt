import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommentsService } from '../../services/comments.service';

@Component({
  selector: 'comments-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments-section.component.html',
  styleUrl: './comments-section.component.scss'
})
export class CommentsSectionComponent implements OnInit {
  @Input() postId!: string;
  public comments: string[] = [];
  public newCommentText: string = '';

  constructor(private commentsService: CommentsService) { }

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.comments = this.commentsService.getComments(this.postId);
  }

  addComment() {
    if (this.newCommentText.trim()) {
      this.commentsService.addComment(this.postId, this.newCommentText);
      this.newCommentText = '';
      this.loadComments();
    }
  }
}