import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'add-post',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-post-component.component.html',
  styleUrl: './add-post-component.component.scss'
})
export class AddPostComponent implements OnInit {
  postForm: FormGroup;
  defaultImage = 'https://placehold.co/600x400';
  urlPattern = '(https?://.*)';

  constructor(
    private fb: FormBuilder, 
    private service: DataService,
    private router: Router
  ) {
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      text: ['', [Validators.required, Validators.minLength(10)]],
      image: [
        { value: this.defaultImage, disabled: true }, 
        [Validators.required, Validators.pattern(this.urlPattern)]
      ],
      hasCustomImage: [false]
    });
  }

  ngOnInit(): void {
    this.postForm.get('hasCustomImage')?.valueChanges.subscribe((checked: boolean) => {
      const imageControl = this.postForm.get('image');
      if (checked) {
        imageControl?.enable();
        imageControl?.setValue(''); 
      } else {
        imageControl?.disable();
        imageControl?.setValue(this.defaultImage);
      }
    });
  }

  get f() { return this.postForm.controls; }

  submitPost() {
    if (this.postForm.valid || (this.postForm.get('image')?.disabled && this.f['title'].valid && this.f['text'].valid)) {
      
      const formData = this.postForm.getRawValue();
      const { hasCustomImage, ...postToSend } = formData;

      this.service.addPost(postToSend).subscribe({
        next: () => {
          this.router.navigate(['/blog']);
        },
        error: (err) => {
          console.error('Błąd podczas dodawania:', err);
          alert('Wystąpił błąd. Upewnij się, że sesja nie wygasła.');
        }
      });
    } else {
      this.postForm.markAllAsTouched();
    }
  }
}