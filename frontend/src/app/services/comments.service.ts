import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class CommentsService {
    private comments: { [postId: string]: string[] } = {};

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.loadFromStorage();
    }

    getComments(postId: any): string[] {
        return this.comments[postId] || [];
    }

    addComment(postId: any, text: string) {
        if (!this.comments[postId]) {
            this.comments[postId] = [];
        }
        this.comments[postId].push(text);
        this.saveToStorage();
    }

    private saveToStorage() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('blog_comments', JSON.stringify(this.comments));
        }
    }

    private loadFromStorage() {
        if (isPlatformBrowser(this.platformId)) {
            const data = localStorage.getItem('blog_comments');
            if (data) {
                this.comments = JSON.parse(data);
            }
        }
    }
}