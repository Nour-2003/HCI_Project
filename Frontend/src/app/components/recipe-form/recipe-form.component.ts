import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { FileUpload } from 'primeng/fileupload';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    FileUploadModule,
    HttpClientModule,
    RouterModule,
  ],
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css'],
})
export class RecipeFormComponent {
  recipeForm: FormGroup;
  selectedPhoto: string | null = null;
  user: any = null;
  isSubmitting = false;
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {
    this.recipeForm = this.fb.group({
      title: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      description: ['', [Validators.required]],
      ingredients: this.fb.array([], Validators.required),
      steps: this.fb.array([], Validators.required),
      servings: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      level: [
        '',
        [Validators.required, Validators.pattern(/^(Easy|Medium|Hard)$/)],
      ],
      tags: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      calories: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      prepTime: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      cookTime: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      totalTime: [{ value: '', disabled: true }],
      photo: [null, Validators.required],
    });

    this.userService.getUser().subscribe((data) => {
      this.user = data;
    });
    // Add initial ingredient and step fields
    this.addIngredient();
    this.addStep();

    // Subscribe to changes in prepTime and cookTime to calculate totalTime
    this.recipeForm
      .get('prepTime')
      ?.valueChanges.subscribe(() => this.updateTotalTime());
    this.recipeForm
      .get('cookTime')
      ?.valueChanges.subscribe(() => this.updateTotalTime());
  }

  updateTotalTime() {
    const prepTime = parseInt(
      this.recipeForm.get('prepTime')?.value || '0',
      10
    );
    const cookTime = parseInt(
      this.recipeForm.get('cookTime')?.value || '0',
      10
    );
    const totalTime = prepTime + cookTime;
    this.recipeForm.get('totalTime')?.setValue(totalTime.toString());
  }

  get ingredients() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  addIngredient() {
    this.ingredients.push(this.fb.control('', Validators.required));
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  get steps() {
    return this.recipeForm.get('steps') as FormArray;
  }

  addStep() {
    this.steps.push(this.fb.control('', Validators.required));
  }

  removeStep(index: number) {
    this.steps.removeAt(index);
  }

  onPhotoSelect(event: any) {
    const file = event.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedPhoto = e.target.result;
        this.recipeForm.patchValue({
          photo: file,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto() {
    this.selectedPhoto = null;
    this.recipeForm.patchValue({
      photo: null,
    });
    this.fileUpload.clear();
  }

  getErrorMessage(controlName: string): string | null {
    const control = this.recipeForm.get(controlName);

    if (control && control.invalid && control.touched) {
      const errors = control.errors;

      if (errors?.['required']) {
        return 'This field is required.';
      }
      if (errors?.['pattern']) {
        return 'Invalid format';
      }
      if (errors?.['minlength']) {
        return `Minimum length is ${errors['minlength'].requiredLength}.`;
      }
      if (errors?.['maxlength']) {
        return `Maximum length is ${errors['maxlength'].requiredLength}.`;
      }
    }

    return null;
  }

  cancelForm() {
    this.recipeForm.reset();
    this.selectedPhoto = null;
    if (this.fileUpload) {
      this.fileUpload.clear();
    }
    this.isSubmitting = false;
    this.router.navigate([`/profile/recipes/${this.user.id}`]);
  }

  onSubmit() {
    if (this.recipeForm.valid) {
      this.isSubmitting = true;

      const formData = new FormData();
      formData.append('title', this.recipeForm.get('title')?.value);
      formData.append('description', this.recipeForm.get('description')?.value);

      const ingredients = this.ingredients.controls.map((control) => ({
        name: control.value,
        quantity: 1, // Replace with actual quantity input if present
        unit: 'g', // Replace with actual unit input if present
      }));
      formData.append('ingredients', JSON.stringify(ingredients));

      formData.append(
        'steps',
        JSON.stringify(this.steps.controls.map((control) => control.value))
      );
      formData.append(
        'cooktime',
        Number(this.recipeForm.get('totalTime')?.value).toString()
      );
      formData.append('level', this.recipeForm.get('level')?.value);
      formData.append(
        'calories',
        Number(this.recipeForm.get('calories')?.value).toString()
      );
      formData.append(
        'serves',
        Number(this.recipeForm.get('servings')?.value).toString()
      );
      formData.append('specialTag', this.recipeForm.get('tags')?.value);

      const photoFile = this.recipeForm.get('photo')?.value;
      if (photoFile) {
        formData.append('imageMessage', photoFile);
      }

      const endpoint = `http://localhost:8080/user/${this.user.id}/recipes`;

      this.http.post(endpoint, formData).subscribe(
        (response: any) => {
          if (response.statusCode === 201) {
            this.router.navigate([`/profile/recipes/${this.user.id}`]);

            Swal.fire({
              title: 'Recipe submitted!',
              text: 'Your recipe has been submitted successfully.',
              icon: 'success',
              confirmButtonText: 'OK',
            });
          }
          this.isSubmitting = false; // Stop loader
        },
        (error) => {
          console.error('Error submitting recipe:', error);
          Swal.fire({
            title: 'Error submitting recipe',
            text: 'An error occurred while submitting your recipe. Please try again later.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
          this.isSubmitting = false; // Stop loader
        }
      );
    } else {
      console.error('Form is invalid!');
    }
  }
}
