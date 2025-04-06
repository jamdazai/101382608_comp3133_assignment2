/**
 * @author: Jam Furaque
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  loginForm!: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { usernameOrEmail, password } = this.loginForm.value;
      this.authService.login(usernameOrEmail, password).subscribe({
        next: (data) => {
          if (data?.token && data?.user) {
            this.authService.setToken(data.token);
            this.authService.setUser(data.user);
            this.router.navigate(['/employees']);
          } else {
            this.errorMessage = 'Invalid credentials. Please try again.';
            alert(this.errorMessage);
          }
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = 'Invalid credentials. Please try again.';
          alert(this.errorMessage);
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  
  
}