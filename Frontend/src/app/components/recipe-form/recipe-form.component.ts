import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
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
  ],
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css'],
})
export class RecipeFormComponent {
  recipeForm: FormGroup;
  selectedPhoto: string | null = null;
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  constructor(private fb: FormBuilder) {
    this.recipeForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      ingredients: this.fb.array([], Validators.required),
      steps: this.fb.array([], Validators.required),
      servings: ['', Validators.required],
      level: ['', Validators.required],
      tags: ['', Validators.required],
      calories: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      prepTime: ['', [Validators.required, Validators.pattern(/^\d+$/)]], // Only numbers allowed
      cookTime: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      totalTime: [{ value: '', disabled: true }], // Read-only field
      photo: [null, Validators.required],
    });

    // Add initial ingredient and step fields
    this.addIngredient();
    this.addStep();

    // Subscribe to changes in prepTime and cookTime
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
  }

  onSubmit() {
    if (this.recipeForm.valid) {
      console.log(this.recipeForm.value);
      // Handle form submission here
    }
  }
}
