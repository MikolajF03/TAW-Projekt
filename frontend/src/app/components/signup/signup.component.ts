import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(15)]]
    });
  }

  get f() { return this.signupForm.controls; }

  create() {
    if (this.signupForm.invalid) {
      return;
    }

    this.authService.createOrUpdate(this.signupForm.value).subscribe({
      next: () => {
        alert('Konto zostało utworzone! Możesz się teraz zalogować.');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        console.error('Błąd rejestracji:', err);
        alert('Wystąpił błąd podczas rejestracji. Spróbuj użyć innego e-maila.');
      }
    });
  }
}