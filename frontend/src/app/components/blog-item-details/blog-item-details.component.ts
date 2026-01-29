import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { DataService } from "../../services/data.service";
import { AuthService } from "../../services/auth.service";
import { CommentsSectionComponent } from '../comments-section/comments-section.component';
import { LikeButtonComponent } from '../like-button/like-button.component';

@Component({
  selector: 'app-blog-item-details',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    CommentsSectionComponent, 
    LikeButtonComponent,
    ReactiveFormsModule
  ],
  templateUrl: './blog-item-details.component.html',
  styleUrl: './blog-item-details.component.scss'
})
export class BlogItemDetailsComponent implements OnInit {
  public post: any = null;
  public id: string = '';
  public isOwner: boolean = false;
  public isEditMode: boolean = false;
  public editForm: FormGroup;

  constructor(
    private service: DataService, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.editForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      image: ['', [Validators.required, Validators.pattern('(https?://.*)')]],
      text: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id') || '';
      if (this.id) {
        this.loadPost();
      }
    });
  }

  get f() { return this.editForm.controls; }

  loadPost() {
    this.service.getById(this.id).subscribe((res: any) => {
      this.post = res;
      this.editForm.patchValue({
        title: res.title,
        image: res.image,
        text: res.text
      });

      if (isPlatformBrowser(this.platformId)) {
        this.checkOwnership();
      }
    });
  }

  checkOwnership() {
    const user = this.authService.currentUser;
    if (user && this.post && this.post.authorId) {
      const userId = user._id || user.id || user.userId;
      this.isOwner = String(userId) === String(this.post.authorId);
    } else {
      this.isOwner = false;
    }
  }

  saveEdit() {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.service.updatePost(this.id, this.editForm.value).subscribe({
      next: () => {
        this.post = { ...this.post, ...this.editForm.value };
        this.isEditMode = false;
        alert('Zmiany zostały zapisane.');
      },
      error: (err) => {
        console.error('Błąd edycji:', err);
        alert('Wystąpił błąd podczas zapisywania zmian.');
      }
    });
  }

  deletePost() {
    if (confirm('Czy na pewno chcesz usunąć ten post?')) {
      this.service.deletePost(this.id).subscribe({
        next: () => {
          alert('Post został usunięty.');
          this.router.navigate(['/blog']);
        },
        error: (err) => {
          console.error('Błąd usuwania:', err);
          alert('Nie udało się usunąć posta.');
        }
      });
    }
  }
}