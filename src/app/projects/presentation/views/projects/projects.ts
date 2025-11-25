import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectsStore } from '@projects/application/projects-store';
import { PropertyProject } from '@projects/domain/property-project.entity';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Projects implements OnInit {
  private readonly projectsStore = inject(ProjectsStore);
  private readonly fb = inject(FormBuilder);

  // Signals
  readonly searchTerm = signal<string>('');
  readonly showForm = signal<boolean>(false);
  readonly editingProject = signal<PropertyProject | null>(null);
  readonly formSubmitting = signal<boolean>(false);

  // Form
  propertyForm!: FormGroup;

  // Data from store
  readonly properties = this.projectsStore.propertyProjects;
  readonly loading = this.projectsStore.loading;
  readonly error = this.projectsStore.error;

  // Filtered properties based on search
  readonly filteredProperties = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.properties();

    return this.properties().filter(property =>
      property.property_code.toLowerCase().includes(term) ||
      property.project.toLowerCase().includes(term) ||
      property.type.toLowerCase().includes(term) ||
      property.status.toLowerCase().includes(term)
    );
  });

  constructor() {
    // Watch for editing project changes to populate form
    effect(() => {
      const project = this.editingProject();
      if (project) {
        this.populateForm(project);
      } else {
        this.resetForm();
      }
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialize the property form
   */
  private initializeForm(): void {
    this.propertyForm = this.fb.group({
      property_code: ['', [Validators.required, Validators.maxLength(20)]],
      project: ['', [Validators.required, Validators.maxLength(100)]],
      type: ['', [Validators.required, Validators.maxLength(50)]],
      status: ['DISPONIBLE', Validators.required],
      area: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]],
      address: [''],
      district: ['']
    });
  }

  /**
   * Populate form with existing property data
   */
  private populateForm(property: PropertyProject): void {
    this.propertyForm.patchValue({
      property_code: property.property_code,
      project: property.project,
      type: property.type,
      status: property.status,
      area: property.area,
      price: property.price,
      address: '',
      district: ''
    });
  }

  /**
   * Reset form to default values
   */
  private resetForm(): void {
    this.propertyForm.reset({
      property_code: '',
      project: '',
      type: '',
      status: 'DISPONIBLE',
      area: '',
      price: '',
      address: '',
      district: ''
    });
  }

  /**
   * Apply search filter
   */
  onApplyFilter(): void {
    // The filter is already applied through the computed signal
    // This method can be used for additional logic if needed
  }

  /**
   * Clear search filter
   */
  onClearFilter(): void {
    this.searchTerm.set('');
  }

  /**
   * Open form to create new property
   */
  onCreateProperty(): void {
    this.editingProject.set(null);
    this.showForm.set(true);
  }

  /**
   * Open form to edit existing property
   */
  onEditProperty(property: PropertyProject): void {
    this.editingProject.set(property);
    this.showForm.set(true);
  }

  /**
   * Delete property
   */
  onDeleteProperty(id: number): void {
    if (confirm('¿Está seguro de eliminar este inmueble?')) {
      this.projectsStore.deletePropertyProject(id);
    }
  }

  /**
   * Close form
   */
  onCloseForm(): void {
    this.showForm.set(false);
    this.editingProject.set(null);
    this.resetForm();
  }

  /**
   * Submit the property form
   */
  onSubmitForm(): void {
    if (this.propertyForm.invalid) {
      this.propertyForm.markAllAsTouched();
      return;
    }

    this.formSubmitting.set(true);
    const formValue = this.propertyForm.value;
    const editingProject = this.editingProject();

    if (editingProject) {
      // Update existing property
      const updatedProperty = new PropertyProject({
        id: editingProject.id,
        property_code: formValue.property_code,
        project: formValue.project,
        type: formValue.type,
        area: formValue.area,
        price: parseFloat(formValue.price),
        availability: editingProject.availability, // Keep existing availability
        status: formValue.status
      });

      this.projectsStore.updatePropertyProject(updatedProperty);
    } else {
      // Create new property
      const newProperty = new PropertyProject({
        id: this.getNextId(),
        property_code: formValue.property_code,
        project: formValue.project,
        type: formValue.type,
        area: formValue.area,
        price: parseFloat(formValue.price),
        availability: 0, // Default to 0 for new properties
        status: formValue.status
      });

      this.projectsStore.addPropertyProject(newProperty);
    }

    this.formSubmitting.set(false);
    this.onCloseForm();
  }

  /**
   * Get next available ID for new property
   */
  private getNextId(): number {
    const properties = this.properties();
    if (properties.length === 0) return 1;
    return Math.max(...properties.map(p => p.id)) + 1;
  }

  /**
   * Format currency
   */
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  /**
   * Get status class for styling
   */
  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'DISPONIBLE': 'status-available',
      'RESERVADO': 'status-reserved',
      'VENDIDO': 'status-sold',
      'EN_CONSTRUCCION': 'status-construction'
    };
    return statusMap[status.toUpperCase()] || 'status-available';
  }
}
