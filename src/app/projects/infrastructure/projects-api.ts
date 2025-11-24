import {Injectable} from '@angular/core';
import {BaseApi} from '@shared/infrastructure/http/base-api';
import {BondsApiEndpoint} from '@projects/infrastructure/bonds-api-endpoint';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Bond} from '@projects/domain/bond.entity';
import {PropertyProjectsApiEndpoint} from '@projects/infrastructure/property-projects-api-endpoint';
import {PropertyProject} from '@projects/domain/property-project.entity';

/**
 * Projects API service to interact with bond endpoints.
 */
@Injectable({
    providedIn: 'root'
})
export class ProjectsApi extends BaseApi {
  /**
   * Bonds API endpoint.
   * @private
   */
  private readonly bondsEndpoint: BondsApiEndpoint;
  /**
   * Property Projects API endpoint.
   * @private
   */
  private readonly propertyProjectsEndpoint: PropertyProjectsApiEndpoint;

  /**
   * Constructor to initialize the Projects API service with HTTP client.
   * @param http - The HTTP client to make API requests.
   */
  constructor(http: HttpClient) {
    super();
    this.bondsEndpoint = new BondsApiEndpoint(http);
    this.propertyProjectsEndpoint = new PropertyProjectsApiEndpoint(http);
  }

  /**
   * Get all bonds.
   * @returns An observable of an array of bonds.
   */
  getBonds(): Observable<Bond[]> {
    return this.bondsEndpoint.getAll();
  }

  /**
   * Get a bond by ID.
   * @param id - The ID of the bond to retrieve.
   * @returns An observable of the bond.
   */
  getBond(id: number): Observable<Bond> {
    return this.bondsEndpoint.getById(id);
  }

  /**
   * Create a new bond.
   * @param bond - The bond data to create.
   * @returns An observable of the created bond.
   */
  createBond(bond: Bond): Observable<Bond> {
    return this.bondsEndpoint.create(bond);
  }

  /**
   * Update an existing bond.
   * @param bond - The bond data to update.
   * @returns An observable of the updated bond.
   */
  updateBond(bond: Bond): Observable<Bond> {
    return this.bondsEndpoint.update(bond, bond.id);
  }

  /**
   * Delete a bond by ID.
   * @param id - The ID of the bond to delete.
   * @returns An observable of void.
   */
  deleteBond(id: number): Observable<void> {
    return this.bondsEndpoint.delete(id);
  }

  /**
   * Get all property projects.
   * @returns An observable of an array of property projects.
   */
  getPropertyProjects(): Observable<PropertyProject[]> {
    return this.propertyProjectsEndpoint.getAll();
  }

  /**
   * Get a property project by ID.
   * @param id - The ID of the property project to retrieve.
   * @returns An observable of the property project.
   */
  getPropertyProject(id: number): Observable<PropertyProject> {
    return this.propertyProjectsEndpoint.getById(id);
  }

  /**
   * Create a new property project.
   * @param project - The property project data to create.
   * @returns An observable of the created property project.
   */
  createPropertyProject(project: PropertyProject): Observable<PropertyProject> {
    return this.propertyProjectsEndpoint.create(project);
  }

  /**
   * Update an existing property project.
   * @param project - The property project data to update.
   * @returns An observable of the updated property project.
   */
  updatePropertyProject(project: PropertyProject): Observable<PropertyProject> {
    return this.propertyProjectsEndpoint.update(project, project.id);
  }

  /**
   * Delete a property project by ID.
   * @param id - The ID of the property project to delete.
   * @returns An observable of void.
   */
  deletePropertyProject(id: number): Observable<void> {
    return this.propertyProjectsEndpoint.delete(id);
  }
}
