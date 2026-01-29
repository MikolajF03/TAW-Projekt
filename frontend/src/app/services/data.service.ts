import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private url = 'http://localhost:3100/api';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(`${this.url}/posts`);
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${this.url}/posts/${id}`);
  }

  addPost(post: any): Observable<any> {
    return this.http.post(`${this.url}/posts`, post); 
  }

  updatePost(id: string, data: any): Observable<any> {
    return this.http.put(`${this.url}/posts/${id}`, data);
  }

  deletePost(id: string): Observable<any> {
    return this.http.delete(`${this.url}/posts/${id}`, { responseType: 'text' as 'json' });
  }
  toggleLike(postId: string): Observable<any> {
    return this.http.post(`${this.url}/posts/${postId}/like`, {});
  }
}