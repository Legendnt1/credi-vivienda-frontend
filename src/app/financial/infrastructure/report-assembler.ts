import {BaseAssembler} from '@shared/infrastructure/http/base-assembler';
import {Report} from '@financial/domain/model/report.entity';
import {ReportResource, ReportResponse} from '@financial/infrastructure/report-response';

/**
 * Assembler for converting between Report entities and Report resources/responses
 */
export class ReportAssembler implements BaseAssembler<Report, ReportResource, ReportResponse> {
  /**
   * Converts a ReportResponse to an array of Report entities
   * @param response - The ReportResponse to convert
   * @returns An array of Report entities
   */
  toEntitiesFromResponse(response: ReportResponse): Report[] {
    return response.reports.map(resource => this.toEntityFromResource(resource as ReportResource));
  }

  /**
   * Converts a ReportResource to a Report entity
   * @param resource - The ReportResource to convert
   * @returns A Report entity
   */
  toEntityFromResource(resource: ReportResource): Report {
    return new Report({
      id: resource.id,
      user_id: resource.user_id,
      credit_id: resource.credit_id,
      property_project_id: resource.property_project_id,
      settings_id: resource.settings_id,
      generated_at: resource.generated_at,
      price: resource.price,
      down_payment: resource.down_payment,
      bond_applied: resource.bond_applied,
      years: resource.years,
      frequency: resource.frequency,
      base_tea: resource.base_tea,
      total_installments_paid: resource.total_installments_paid,
      total_amortization: resource.total_amortization,
      total_interest: resource.total_interest,
      van: resource.van,
      tir: resource.tir,
      cet: resource.cet
    });
  }

  /**
   * Converts a Report entity to a ReportResource
   * @param entity - The Report entity to convert
   * @returns A ReportResource
   */
  toResourceFromEntity(entity: Report): ReportResource {
    return {
      id: entity.id,
      user_id: entity.user_id,
      credit_id: entity.credit_id,
      property_project_id: entity.property_project_id,
      settings_id: entity.settings_id,
      generated_at: entity.generated_at,
      price: entity.price,
      down_payment: entity.down_payment,
      bond_applied: entity.bond_applied,
      years: entity.years,
      frequency: entity.frequency,
      base_tea: entity.base_tea,
      total_installments_paid: entity.total_installments_paid,
      total_amortization: entity.total_amortization,
      total_interest: entity.total_interest,
      van: entity.van,
      tir: entity.tir,
      cet: entity.cet
    } as ReportResource;
  }

}
