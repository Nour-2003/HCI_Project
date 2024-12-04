import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms'; // Reactive forms
import { RouterModule } from '@angular/router'; // Router module for navigation
import { InputTextModule } from 'primeng/inputtext'; // PrimeNG input text module
import { ButtonModule } from 'primeng/button'; // PrimeNG button module
import { CommonModule } from '@angular/common'; // Common module for basic Angular functionalities
import { HttpClientModule, HttpClient } from '@angular/common/http'; // Import HttpClientModule and HttpClient
import { UserService } from '../../services/user.service'; // Import UserService
import { Router } from '@angular/router'; // Import Router
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    InputTextModule,
    ButtonModule,
    ReactiveFormsModule,
    HttpClientModule, // Add HttpClientModule here
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName} is required.`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address.';
    }
    if (control?.hasError('minlength')) {
      return `${controlName} must be at least ${control.errors?.['minlength'].requiredLength} characters long.`;
    }
    if (controlName === 'confirmPassword' && this.registerForm.hasError('mismatch')) {
      return 'Passwords do not match.';
    }
    return '';
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = null;

      const { username, email, password } = this.registerForm.value;

      const payload = {
        username,
        email,
        password,
      };

      console.log('Registering user:', payload);
      

      this.http.post('http://localhost:8080/auth/signup', payload).subscribe(
        (response: any) => {
          console.log( response);
          if(response.status === "SUCCESS"){
            this.userService.setUser(response.data);
            this.router.navigate(['/home']);
          }else{
            this.errorMessage = response.message;
          }
        },
        (error) => {
          console.error('Registration Failed:', error);
          this.errorMessage = 'Failed to register. Please try again.';
        },
        () => {
          this.loading = false;
        }
      );
    } else {
      console.log('Form is not valid');
    }
  }
}
