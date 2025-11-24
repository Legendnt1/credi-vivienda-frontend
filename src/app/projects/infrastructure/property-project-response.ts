import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Represents the response structure for Property Projects in the projects bounded context.
 */
export interface PropertyProjectResponse extends BaseResponse {
  /**
   * The list of property projects.
   */
  propertyProjects: PropertyProjectResource[];
}

/**
 * Represents a Property Project resource in the projects bounded context.
 */
export interface PropertyProjectResource extends BaseResource {
  /**
   * The unique identifier of the property project.
   */
  id: number;
  /**
   * The name of the project.
   */
  project: string;
  /**
   * The type of the property.
   */
  type: string;
  /**
   * The area of the property.
   */
  area: string;
  /**
   * The price of the property.
   */
  price: number;
  /**
   * The availability status of the property.
   */
  availability: number;
}
