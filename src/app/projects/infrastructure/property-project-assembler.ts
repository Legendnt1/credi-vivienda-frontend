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
      project: resource.project,
      type: resource.type,
      area: resource.area,
      price: resource.price,
      availability: resource.availability
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
      project: entity.project,
      type: entity.type,
      area: entity.area,
      price: entity.price,
      availability: entity.availability
    } as PropertyProjectResource;
  }

}
