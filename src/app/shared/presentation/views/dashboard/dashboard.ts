import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IamStore } from '@iam/application/iam-store';
import { FinancialStore } from '@financial/application/financial-store';
import { ProjectsStore } from '@projects/application/projects-store';
import { Report } from '@financial/domain/model/report.entity';
import { User } from '@iam/domain/model/user.entity';
import { PropertyProject } from '@projects/domain/property-project.entity';

interface KPI {
  icon: string;
  value: string | number;
  label: string;
  change: number;
  changePositive: boolean;
}

interface ClientData {
  user: User;
  report: Report;
  property: PropertyProject | undefined;
  date: string;
  status: 'pending' | 'in_evaluation' | 'approved' | 'rejected';
}

interface ChartData {
  label: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, TranslateModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Dashboard {
  private readonly iamStore = inject(IamStore);
  private readonly financialStore = inject(FinancialStore);
  private readonly projectsStore = inject(ProjectsStore);

  // Signals for filters
  readonly selectedDateRange = signal<string>('thisWeek');
  readonly selectedProgram = signal<string>('all');

  // Computed data from stores
  readonly reports = this.financialStore.reports;
  readonly users = this.iamStore.users;
  readonly properties = this.projectsStore.propertyProjects;
  readonly currentUser = this.iamStore.sessionUser;

  // KPIs computed from real data
  readonly kpis = computed<KPI[]>(() => {
    const reports = this.reports();
    const totalSimulations = reports.length;
    const totalAmount = reports.reduce((sum, report) => sum + (report.price || 0), 0);
    const availableProperties = this.properties().filter(p => p.status === 'approved').length;

    // Calculate approval rate based on property status
    const approvedProperties = this.properties().filter(p => p.status === 'approved').length;
    const totalProperties = this.properties().length;
    const approvalRate = totalProperties > 0 ? Math.round((approvedProperties / totalProperties) * 100) : 0;

    return [
      {
        icon: 'calculator',
        value: totalSimulations,
        label: 'dashboard.kpis.creditsSimulated',
        change: 12,
        changePositive: true
      },
      {
        icon: 'dollar-sign',
        value: `S/ ${(totalAmount / 1000).toFixed(1)}K`,
        label: 'dashboard.kpis.totalAmount',
        change: 8,
        changePositive: true
      },
      {
        icon: 'home',
        value: availableProperties,
        label: 'dashboard.kpis.availableProperties',
        change: -3,
        changePositive: false
      },
      {
        icon: 'trending-up',
        value: `${approvalRate}%`,
        label: 'dashboard.kpis.approvedCredits',
        change: 5,
        changePositive: true
      }
    ];
  });

  // Recent clients computed from real data
  readonly clientsData = computed<ClientData[]>(() => {
    const reports = this.reports();
    const users = this.users();
    const properties = this.properties();

    return reports.slice(0, 5).map((report) => {
      const user = users.find(u => u.id === report.user_id);
      const property = properties.find(p => p.id === report.property_project_id);

      if (!user) return null;

      // Determine status based on property status or random for demo
      let status: 'pending' | 'in_evaluation' | 'approved' | 'rejected' = 'pending';
      if (property) {
        if (property.status === 'approved') status = 'approved';
        else if (property.status === 'in_evaluation') status = 'in_evaluation';
        else if (property.status === 'rejected') status = 'rejected';
        else status = 'pending';
      }

      return {
        user,
        report,
        property,
        date: report.generated_at,
        status
      };
    }).filter(Boolean) as ClientData[];
  });

  // Chart Data based on property status
  readonly chartData = computed<ChartData[]>(() => {
    const properties = this.properties();

    const pending = properties.filter(p => p.status === 'pending').length;
    const inEvaluation = properties.filter(p => p.status === 'in_evaluation').length;
    const approved = properties.filter(p => p.status === 'approved').length;
    const rejected = properties.filter(p => p.status === 'rejected').length;

    return [
      { label: 'Pendiente', value: pending, color: 'var(--color-secondary)' },
      { label: 'En evaluación', value: inEvaluation, color: '#3b82f6' },
      { label: 'Aprobado', value: approved, color: 'var(--color-success)' },
      { label: 'Rechazado', value: rejected, color: 'var(--color-error)' }
    ];
  });

  readonly chartSummary = computed(() => {
    const data = this.chartData();
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const approved = data.find(item => item.label === 'Aprobado')?.value || 0;
    const percentage = total > 0 ? Math.round((approved / total) * 100) : 0;
    return {
      total,
      approved,
      percentage
    };
  });

  readonly maxChartValue = computed(() => {
    const values = this.chartData().map(d => d.value);
    const max = Math.max(...values, 10);
    // Round up to nearest 5 or 10 for better scale
    return Math.ceil(max / 10) * 10;
  });

  /**
   * Generate Y-axis labels dynamically
   */
  readonly yAxisLabels = computed(() => {
    const max = this.maxChartValue();
    const labels: number[] = [];
    const steps = 10; // Number of grid lines

    for (let i = steps; i >= 0; i--) {
      labels.push(Math.round((max / steps) * i));
    }

    return labels;
  });

  // Featured property - select first approved property
  readonly featuredProperty = computed(() => {
    const props = this.properties();
    const approved = props.find(p => p.status === 'approved');
    return approved || (props.length > 0 ? props[0] : null);
  });

  // Education Content
  readonly educationContent = signal({
    title: 'dashboard.education.title',
    description: 'dashboard.education.description',
    updateDate: '28/11/2025'
  });


  // Methods
  /**
   * Calculate bar height percentage
   */
  getBarHeight(value: number): number {
    const max = this.maxChartValue();
    return max > 0 ? (value / max) * 100 : 0;
  }

  setDateRange(range: string): void {
    this.selectedDateRange.set(range);
  }

  setProgram(program: string): void {
    this.selectedProgram.set(program);
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      pending: 'status-pending',
      in_evaluation: 'status-evaluation',
      approved: 'status-approved',
      rejected: 'status-rejected'
    };
    return statusMap[status] || '';
  }

  getProgramBadgeClass(program: string): string {
    const programMap: Record<string, string> = {
      'Fondo MIVIVIENDA': 'program-mivivienda',
      'TECHO_PROPIO': 'program-techo',
      'OTRO': 'program-other'
    };
    return programMap[program] || 'program-other';
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2
    }).format(amount);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  viewClientDetail(userId: number): void {
    console.log('Ver detalle del cliente:', userId);
    // TODO: Navigate to client detail view
  }

  simulateAgain(reportId: number): void {
    console.log('Simular de nuevo desde reporte:', reportId);
    // TODO: Navigate to calculations with pre-filled data from report
  }

  viewPropertyDetail(propertyId: number): void {
    console.log('Ver detalle de propiedad:', propertyId);
    // TODO: Navigate to property detail view
  }

  simulateCredit(propertyId: number): void {
    console.log('Simular crédito para propiedad:', propertyId);
    // TODO: Navigate to calculations with selected property
  }

  downloadGuide(): void {
    console.log('Descargar guía PDF');
    // TODO: Implement PDF download
  }
}


