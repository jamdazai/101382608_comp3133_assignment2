import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GraphQLService } from '../../services/graphql.service';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})

export class SignupComponent {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private graphqlService: GraphQLService, private router: Router) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    console.log('🔍 Sending form:', this.signupForm.value);
    if (this.signupForm.valid) {
      this.graphqlService.signup(this.signupForm.value).subscribe({
        next: (res) => {
          alert('Signup successful!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          if (err.message.includes('duplicate key error')) {
            alert('This username or email is already taken.');
          } else {
            alert('Signup failed. Please try again.');
            console.error('Error during signup:', err);
          }
        }
        
      });
    } else {
      console.log('Invalid form from signup component');
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
  
}