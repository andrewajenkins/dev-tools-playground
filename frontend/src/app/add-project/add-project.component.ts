import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent {
  projectForm: FormGroup;
  loading = false;
  error = '';
  success = false;

  statusOptions = [
    { value: 'On Track', label: 'On Track' },
    { value: 'At Risk', label: 'At Risk' },
    { value: 'Delayed', label: 'Delayed' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private router: Router
  ) {
    this.projectForm = this.formBuilder.group({
      projectName: ['', [Validators.required, Validators.minLength(3)]],
      status: ['', Validators.required],
      lead: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.markFormGroupTouched(this.projectForm);
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = false;

    const projectData = this.projectForm.value;

    this.projectService.createProject(projectData).subscribe({
      next: (response) => {
        this.success = true;
        this.loading = false;
        this.projectForm.reset();
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (error) => {
        this.error = 'Failed to create project. Please try again.';
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/dashboard']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
} 