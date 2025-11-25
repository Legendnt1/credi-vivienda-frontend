import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Bond} from '@projects/domain/bond.entity';
import {BondResource, BondResponse} from '@projects/infrastructure/bond-response';

/**
 * Assembler for converting between Bond entities and their corresponding resources.
 */
export class BondAssembler implements BaseAssembler<Bond, BondResource, BondResponse> {
  /**
   * Converts a BondResponse to an array of Bond entities.
   * @param response - The BondResponse to convert.
   * @returns An array of Bond entities.
   */
  toEntitiesFromResponse(response: BondResponse): Bond[] {
    return response.bonds.map(resource => this.toEntityFromResource(resource as BondResource));
  }

  /**
   * Converts a BondResource to a Bond entity.
   * @param resource - The BondResource to convert.
   * @returns A Bond entity.
   */
  toEntityFromResource(resource: BondResource): Bond {
    return new Bond({
      id: resource.id,
      name: resource.name,
      total_bond: resource.total_bond
    });
  }

  /**
   * Converts a Bond entity to a BondResource.
   * @param entity - The Bond entity to convert.
   * @returns A BondResource.
   */
  toResourceFromEntity(entity: Bond): BondResource {
    return {
      id: entity.id,
      name: entity.name,
      total_bond: entity.total_bond
    } as BondResource;
  }

}
