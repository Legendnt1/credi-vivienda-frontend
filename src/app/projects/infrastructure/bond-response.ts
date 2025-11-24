import {BaseResource, BaseResponse} from '@shared/infrastructure/http/base-response';

/**
 * Represents the response structure for Bond resources.
 */
export interface BondResponse extends BaseResponse {
  /**
   * An array of Bond resources.
   */
  bonds: BondResource[];
}

/**
 * Represents a Bond resource in the projects bounded context.
 */
export interface BondResource extends BaseResource {
  /**
   * The unique identifier of the bond.
   */
  id: number;
  /**
   * The name of the bond.
   */
  name: string;
  /**
   * The total bond amount.
   */
  total_bond: number;
}
