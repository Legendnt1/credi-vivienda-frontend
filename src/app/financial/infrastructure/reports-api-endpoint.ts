import {BaseApiEndpoint} from '@shared/infrastructure/http/base-api-endpoint';
import {Report} from '@financial/domain/model/report.entity';
import {ReportResource, ReportResponse} from '@financial/infrastructure/report-response';
import {ReportAssembler} from '@financial/infrastructure/report-assembler';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

/**
 * API endpoint for managing Report entities.
 */
export class ReportsApiEndpoint extends BaseApiEndpoint<Report, ReportResource, ReportResponse, ReportAssembler> {
  /**
   * Creates a new ReportsApiEndpoint instance.
   * @param http - The HttpClient to use for API requests.
   */
  constructor(http: HttpClient) {
    super(http, `${environment.crediViviendaProviderApiBaseUrl}${environment.crediViviendaProviderReportsEndpointPath}`,
      new ReportAssembler(), { usePathParams: environment.usePathParams });
  }
}
