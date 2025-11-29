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
   * The code of the property.
   */
  property_code: string;
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
  area: number;
  /**
   * The price of the property.
   */
  price: number;
  /**
   * The currency catalog ID for the property's price.
   */
  currency_catalog_id: number;
  /**
   * The availability status of the property.
   */
  availability: number;
  /**
   * The status of the property project.
   */
  status: string;
  /**
   * The address of the property.
   */
  address: string;
  /**
   * The district where the property is located.
   */
  district: string;
  /**
   * The province where the property is located.
   */
  province: string;
}
