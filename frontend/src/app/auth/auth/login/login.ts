import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, AuthResponse } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response: AuthResponse) => {
        localStorage.setItem('userId', response.userId.toString());
        localStorage.setItem('username', response.username);

        this.router.navigate(['/decks']);
      },
      error: () => {
        this.errorMessage = 'Invalid email or password';
      }
    });
  }
}
