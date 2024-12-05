import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ReactiveFormsModule,
    HttpClientModule, // Ensure HttpClientModule is imported
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {
    // Initialize the form with email and password controls with validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  // Submit handler for the login form
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = null;

      const { email, password } = this.loginForm.value;
      const payload = { email, password };

      // Make the API call
      this.http.post('http://localhost:8080/auth/login', payload).subscribe(
        (response: any) => {
          console.log(response);

          // Save the user data using UserService
          if (response.status === 'SUCCESS') {
            this.userService.setUser(response.data);
            this.userService.loadUser();
            this.router.navigate(['/home']);
          } else {
            this.errorMessage = response.message;
          }
        },
        (error) => {
          console.error('Login Failed:', error);
          this.errorMessage = 'Invalid email or password.';
        },
        () => {
          this.loading = false;
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  // Function to get error messages for the form fields
  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName} is required.`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address.';
    }
    if (control?.hasError('minlength')) {
      return `${controlName} must be at least ${control.errors?.['minlength'].requiredLength} characters long.`;
    }
    return '';
  }
}
