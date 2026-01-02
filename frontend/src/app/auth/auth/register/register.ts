import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  username = '';
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {
    this.errorMessage = '';

    this.authService
      .register(this.username, this.email, this.password)
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: () => {
          this.errorMessage = 'Registration failed';
        }
      });
  }
}
