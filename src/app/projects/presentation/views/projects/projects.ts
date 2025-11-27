import {ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {ProjectsStore} from '@projects/application/projects-store';
import {PropertyProject} from '@projects/domain/property-project.entity';
import {IamStore} from '@iam/application/iam-store';
import {FinancialStore} from '@financial/application/financial-store';
import {CurrencyConversionService} from '@shared/infrastructure/services/currency-conversion.service';

@Component({
  selector: 'app-projects',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Projects implements OnInit {
  private readonly projectsStore = inject(ProjectsStore);
  private readonly iamStore = inject(IamStore);
  private readonly financialStore = inject(FinancialStore);
  readonly currencyService = inject(CurrencyConversionService);
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
  readonly sessionUser = this.iamStore.sessionUser;
  readonly currencyCatalogs = this.financialStore.currencyCatalogs;

  // User settings - get current user's settings
  readonly userSettings = computed(() => {
    const user = this.sessionUser();
    if (!user) return null;
    return this.iamStore.settings().find(s => s.user_id === user.id) || null;
  });

  // User's preferred currency ID
  readonly userCurrencyId = computed(() => {
    const settings = this.userSettings();
     // Default to PEN
    return settings?.default_currency_catalog_id ?? 1;
  });

  // Properties with converted prices based on user's preferred currency
  readonly propertiesWithConvertedPrices = computed(() => {
    const props = this.properties();
    const userCurrencyId = this.userCurrencyId();
    return props.map(property => {
      const displayPrice = this.currencyService.convert(
        property.price,
        property.currency_catalog_id,
        userCurrencyId
      );
      return {
        entity: property,
        displayPrice,
        displayCurrencyId: userCurrencyId,
        originalPrice: property.price,
        originalCurrencyId: property.currency_catalog_id
      };
    });
  });

  // Filtered properties based on search
  readonly filteredProperties = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const propsWithPrices = this.propertiesWithConvertedPrices();

    if (!term) return propsWithPrices;

    return propsWithPrices.filter(item =>
      item.entity.property_code.toLowerCase().includes(term) ||
      item.entity.project.toLowerCase().includes(term) ||
      item.entity.type.toLowerCase().includes(term) ||
      item.entity.status.toLowerCase().includes(term)
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
      status: ['pending', Validators.required],
      area: [0, [Validators.required, Validators.min(1)]],
      availability: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      currency_catalog_id: [1, Validators.required],
      address: ['', [Validators.required, Validators.min(5)]],
      district: ['', [Validators.required, Validators.min(5)]],
      province: ['', [Validators.required, Validators.min(5)]],
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
      availability: property.availability,
      price: property.price,
      currency_catalog_id: property.currency_catalog_id,
      address: property.address,
      district: property.district,
      province: property.province,
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
      status: 'pending',
      area: 0,
      price: 0,
      currency_catalog_id: 1,
      availability: 0,
      address: '',
      district: '',
      province: '',
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
   * Select currency for the property (does NOT convert the price, just sets the currency ID)
   */
  onSelectCurrency(currencyId: number): void {
    this.propertyForm.patchValue({
      currency_catalog_id: currencyId
    });
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
        area: parseInt(formValue.area),
        price: parseFloat(formValue.price),
        currency_catalog_id: parseInt(formValue.currency_catalog_id),
        availability: parseInt(formValue.availability), // Keep existing availability
        status: formValue.status,
        address: formValue.address,
        district: formValue.district,
        province: formValue.province // Keep existing province
      });

      this.projectsStore.updatePropertyProject(updatedProperty);
    } else {
      // Create new property
      const newProperty = new PropertyProject({
        id: this.getNextId(),
        property_code: formValue.property_code,
        project: formValue.project,
        type: formValue.type,
        area: parseInt(formValue.area),
        price: parseFloat(formValue.price),
        currency_catalog_id: formValue.currency_catalog_id,
        availability: parseInt(formValue.availability),
        status: formValue.status,
        address: formValue.address,
        district: formValue.district,
        province: formValue.province,
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
   * Format currency with proper symbol
   */
  formatCurrency(amount: number, currencyId: number = 1): string {
    return this.currencyService.formatAmount(amount, currencyId);
  }

  /**
   * Get currency symbol
   */
  getCurrencySymbol(currencyId: number): string {
    return this.currencyService.getCurrencySymbol(currencyId);
  }

  /**
   * Get currency code
   */
  getCurrencyCode(currencyId: number): string {
    return this.currencyService.getCurrencyCode(currencyId);
  }

  /**
   * Get user's preferred currency name
   */
  getUserCurrencyName(): string {
    const userCurrencyId = this.userCurrencyId();
    const currency = this.currencyCatalogs().find(c => c.id === userCurrencyId);
    return currency?.currency || 'PEN';
  }

  /**
   * Get status class for styling
   */
  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'status-pending',
      'in_evaluation': 'status-evaluation',
      'approved': 'status-approved',
      'rejected': 'status-rejected'
    };
    return statusMap[status.toLowerCase()] || 'status-pending';
  }

  /**
   * Get status translation key
   */
  getStatusTranslation(status: string): string {
    const statusMap: Record<string, string> = {
      'pending': 'Pendiente',
      'in_evaluation': 'En evaluación',
      'approved': 'Aprobado',
      'rejected': 'Rechazado'
    };
    return statusMap[status.toLowerCase()] || status;
  }
}
