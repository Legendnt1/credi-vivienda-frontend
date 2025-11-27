import {computed, Injectable, Signal, signal} from '@angular/core';
import {Bond} from '@projects/domain/bond.entity';
import {ProjectsApi} from '@projects/infrastructure/projects-api';
import {retry} from 'rxjs';
import {PropertyProject} from '@projects/domain/property-project.entity';

/**
 * Service to manage the Projects Store.
 */
@Injectable({
  providedIn: 'root'
})
export class ProjectsStore {
  /**
   * Bonds signal.
   * @private
   */
  private readonly bondsSignal = signal<Bond[]>([]);
  /**
   * Bonds readonly signal.
   */
  readonly bonds = this.bondsSignal.asReadonly();

  /**
   * Property Projects signal.
   * @private
   */
  private readonly propertyProjectsSignal = signal<PropertyProject[]>([]);
  /**
   * Property Projects readonly signal.
   */
  readonly propertyProjects = this.propertyProjectsSignal.asReadonly();

  /**
   * Loading signal.
   * @private
   */
  private readonly loadingSignal = signal<boolean>(false);

  /**
   * Loading readonly signal.
   */
  readonly loading = this.loadingSignal.asReadonly();
  /**
   * Error signal.
   * @private
   */
  private readonly errorSignal = signal<string | null>(null);
  /**
   * Error readonly signal.
   */
  readonly error = this.errorSignal.asReadonly();

  /**
   * Bond count computed signal.
   */
  readonly bondCount = computed(() => this.bondsSignal().length);
  /**
   * Property Project count computed signal.
   */
  readonly propertyProjectCount = computed(() => this.propertyProjects.length);

  /**
   * Constructor to initialize the Projects Store with Projects API.
   * @param projectsApi - The Projects API service.
   */
  constructor(private projectsApi: ProjectsApi) {
    this.loadBonds();
    this.loadPropertyProjects();
  }

  /**
   * Get a bond by ID.
   * @param id - The ID of the bond to retrieve.
   * @returns A signal of the bond or undefined if not found.
   */
  getBondById(id: number | null | undefined): Signal<Bond | undefined> {
    return computed(() => id ? this.bonds().find(b => b.id === id) : undefined);
  }

  getPropertyProjectById(id: number | null | undefined): Signal<PropertyProject | undefined> {
    return computed(() => id ? this.propertyProjects().find(pj => pj.id === id) : undefined);
  }

  /**
   * Add a new bond.
   * @param bond - The bond data to add.
   */
  addBond(bond: Bond): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.projectsApi.createBond(bond).pipe(retry(2)).subscribe({
      next: (createdBond) => {
        this.bondsSignal.set([...this.bonds(), createdBond]);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'Error at creating bond'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Update an existing bond.
   * @param updatedBond - The bond data to update.
   */
  updateBond(updatedBond: Bond): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.projectsApi.updateBond(updatedBond).pipe(retry(2)).subscribe({
      next: bond => {
        this.bondsSignal.update(bonds =>
          bonds.map(b => b.id === bond.id ? bond : b));
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'Error at updating bond'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Delete a bond by ID.
   * @param id - The ID of the bond to delete.
   */
  deleteBond(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.projectsApi.deleteBond(id).pipe(retry(2)).subscribe({
      next: () => {
        this.bondsSignal.update(bonds =>
          bonds.filter(b => b.id !== id));
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'Error at deleting bond'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Add a new property project.
   * @param propertyProject - The property project data to add.
   */
  addPropertyProject(propertyProject: PropertyProject): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.projectsApi.createPropertyProject(propertyProject).pipe(retry(2)).subscribe({
      next: (createdPropertyProject) => {
        this.propertyProjectsSignal.set([...this.propertyProjects(), createdPropertyProject]);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'Error at creating property project'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Update an existing property project.
   * @param updatedPropertyProject - The property project data to update.
   */
  updatePropertyProject(updatedPropertyProject: PropertyProject): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.projectsApi.updatePropertyProject(updatedPropertyProject).pipe(retry(2)).subscribe({
      next: propertyProject => {
        this.propertyProjectsSignal.update(projects =>
          projects.map(pj => pj.id === propertyProject.id ? propertyProject : pj));
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'Error at updating property project'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Delete a property project by ID.
   * @param id - The ID of the property project to delete.
   */
  deletePropertyProject(id: number): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.projectsApi.deletePropertyProject(id).pipe(retry(2)).subscribe({
      next: () => {
        this.propertyProjectsSignal.update(projects =>
          projects.filter(pj => pj.id !== id));
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'Error at deleting property project'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Load all bonds from the API.
   * @private
   */
  private loadBonds(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.projectsApi.getBonds().pipe(retry(2)).subscribe({
      next: (bonds) => {
        console.log('Bonds loaded:', bonds);
        this.bondsSignal.set(bonds);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'Error at loading bonds'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Load all property projects from the API.
   * @private
   */
  private loadPropertyProjects(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    this.projectsApi.getPropertyProjects().pipe(retry(2)).subscribe({
      next: (propertyProjects) => {
        console.log('Property Projects loaded:', propertyProjects);
        this.propertyProjectsSignal.set(propertyProjects);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(this.formatError(error, 'Error at loading property projects'));
        this.loadingSignal.set(false);
      }
    });
  }

  /**
   * Format error messages.
   * @param error - The error object.
   * @param fallback - The fallback message.
   * @returns The formatted error message.
   * @private
   */
  private formatError(error: any, fallback: string): string {
    if (error instanceof Error) {
      return error.message.includes('Recurso no econtrado') ? `${fallback}: No econtrado` : error.message;
    }
    return fallback;
  }
}
