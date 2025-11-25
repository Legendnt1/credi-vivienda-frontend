import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IamStore } from '@iam/application/iam-store';
import { FinancialStore } from '@financial/application/financial-store';
import { ProjectsStore } from '@projects/application/projects-store';
import { Credit } from '@financial/domain/model/credit.entity';
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
  credit: Credit;
  property: PropertyProject | undefined;
  date: string;
  status: 'pending' | 'inEvaluation' | 'approved' | 'rejected';
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
  readonly credits = this.financialStore.credits;
  readonly users = this.iamStore.users;
  readonly properties = this.projectsStore.propertyProjects;
  readonly currentUser = this.iamStore.sessionUser;

  // KPIs computed from real data
  readonly kpis = computed<KPI[]>(() => {
    const credits = this.credits();
    const totalCredits = credits.length;
    const totalAmount = credits.reduce((sum, credit) => sum + (credit.down_payment || 0), 0);
    const availableProperties = this.properties().reduce((sum, prop) => sum + (prop.availability || 0), 0);

    // Simulated approval rate
    const approvedCount = Math.floor(totalCredits * 0.61);
    const approvalRate = totalCredits > 0 ? Math.round((approvedCount / totalCredits) * 100) : 0;

    return [
      {
        icon: 'calculator',
        value: totalCredits,
        label: 'dashboard.kpis.creditsSimulated',
        change: 12,
        changePositive: true
      },
      {
        icon: 'gift',
        value: `S/ ${(totalAmount / 1000000).toFixed(2)}M`,
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
        icon: 'file-analytics',
        value: `${approvalRate}%`,
        label: 'dashboard.kpis.approvedCredits',
        change: 5,
        changePositive: true
      }
    ];
  });

  // Recent clients computed from real data
  readonly clientsData = computed<ClientData[]>(() => {
    const credits = this.credits();
    const users = this.users();
    const properties = this.properties();

    const statuses: Array<'pending' | 'inEvaluation' | 'approved' | 'rejected'> =
      ['pending', 'inEvaluation', 'approved', 'rejected'];

    return credits.map((credit, index) => {
      const user = users.find(u => u.id === credit.user_id);
      const property = properties.find(p => p.id === credit.property_project_id);

      if (!user) return null;

      return {
        user,
        credit,
        property,
        date: new Date().toLocaleDateString('es-PE'),
        status: statuses[index % statuses.length]
      };
    }).filter(Boolean) as ClientData[];
  });

  // Chart Data
  readonly chartData = signal<ChartData[]>([
    { label: 'Pendiente', value: 4, color: 'var(--color-secondary)' },
    { label: 'En evaluación', value: 6, color: 'var(--color-tertiary)' },
    { label: 'Aprobado', value: 11, color: 'var(--color-success)' },
    { label: 'Rechazado', value: 3, color: 'var(--color-error)' }
  ]);

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

  // Featured property
  readonly featuredProperty = computed(() => {
    const props = this.properties();
    return props.length > 0 ? props[0] : null;
  });

  // Education Content
  readonly educationContent = signal({
    title: 'dashboard.education.title',
    description: 'dashboard.education.description',
    updateDate: '15/11/2025'
  });


  // Methods
  /**
   * Calculate bar height percentage
   */
  getBarHeight(value: number): number {
    return (value / this.maxChartValue()) * 100;
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
      inEvaluation: 'status-evaluation',
      approved: 'status-approved',
      rejected: 'status-rejected'
    };
    return statusMap[status] || '';
  }

  getProgramBadgeClass(program: string): string {
    const programMap: Record<string, string> = {
      'MIVIVIENDA': 'program-mivivienda',
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
    return new Date(dateString).toLocaleDateString('es-PE');
  }

  viewClientDetail(userId: number): void {
    console.log('Ver detalle del cliente:', userId);
  }

  simulateAgain(userId: number): void {
    console.log('Simular de nuevo para cliente:', userId);
  }

  viewPropertyDetail(propertyId: number): void {
    console.log('Ver detalle de propiedad:', propertyId);
  }

  simulateCredit(propertyId: number): void {
    console.log('Simular crédito para propiedad:', propertyId);
  }

  downloadGuide(): void {
    console.log('Descargar guía PDF');
  }
}


