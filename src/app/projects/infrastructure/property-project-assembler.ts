import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {PropertyProject} from '@projects/domain/property-project.entity';
import {PropertyProjectResource, PropertyProjectResponse} from '@projects/infrastructure/property-project-response';

/**
 * Assembler for converting between PropertyProject entities and their corresponding resources and responses.
 */
export class PropertyProjectAssembler implements BaseAssembler<PropertyProject, PropertyProjectResource, PropertyProjectResponse> {
  /**
   * Converts a PropertyProjectResponse to an array of PropertyProject entities.
   * @param response - The PropertyProjectResponse to convert.
   * @returns An array of PropertyProject entities.
   */
  toEntitiesFromResponse(response: PropertyProjectResponse): PropertyProject[] {
    return response.propertyProjects.map((resource => this.toEntityFromResource(resource as PropertyProjectResource)));
  }

  /**
   * Converts a PropertyProjectResource to a PropertyProject entity.
   * @param resource - The PropertyProjectResource to convert.
   * @returns A PropertyProject entity.
   */
  toEntityFromResource(resource: PropertyProjectResource): PropertyProject {
    return new PropertyProject({
      id: resource.id,
      property_code: resource.property_code,
      project: resource.project,
      type: resource.type,
      area: resource.area,
      price: resource.price,
      currency_catalog_id: resource.currency_catalog_id,
      availability: resource.availability,
      status: resource.status,
      address: resource.address,
      district: resource.district,
      province: resource.province,
    });
  }

  /**
   * Converts a PropertyProject entity to a PropertyProjectResource.
   * @param entity - The PropertyProject entity to convert.
   * @returns A PropertyProjectResource.
   */
  toResourceFromEntity(entity: PropertyProject): PropertyProjectResource {
    return {
      id: entity.id,
      property_code: entity.property_code,
      project: entity.project,
      type: entity.type,
      area: entity.area,
      price: entity.price,
      currency_catalog_id: entity.currency_catalog_id,
      availability: entity.availability,
      status: entity.status,
      address: entity.address,
      district: entity.district,
      province: entity.province,
    } as PropertyProjectResource;
  }

}
