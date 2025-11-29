import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FinancialStore } from '@financial/application/financial-store';
import { ProjectsStore } from '@projects/application/projects-store';
import { IamStore } from '@iam/application/iam-store';
import { Report } from '@financial/domain/model/report.entity';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-reports',
  imports: [FormsModule, TranslateModule, CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Reports {
  private readonly financialStore = inject(FinancialStore);
  private readonly projectsStore = inject(ProjectsStore);
  private readonly iamStore = inject(IamStore);
  private readonly translate = inject(TranslateService);

  // Stores
  readonly reports = this.financialStore.reports;
  readonly properties = this.projectsStore.propertyProjects;
  readonly credits = this.financialStore.credits;
  readonly currentUser = this.iamStore.sessionUser;

  // Filter signals
  readonly periodFilter = signal<string>('');
  readonly propertyFilter = signal<string>('');
  readonly creditFilter = signal<string>('');

  // Filtered reports based on signals
  readonly filteredReports = computed(() => {
    const allReports = this.reports();
    const period = this.periodFilter();
    const propertyId = this.propertyFilter();
    const creditId = this.creditFilter();

    return allReports.filter(report => {
      // Filter by period (year)
      if (period && period !== '') {
        const reportYear = new Date(report.generated_at).getFullYear().toString();
        if (!reportYear.includes(period)) {
          return false;
        }
      }

      // Filter by property
      if (propertyId && propertyId !== '') {
        if (report.property_project_id !== parseInt(propertyId)) {
          return false;
        }
      }

      // Filter by credit
      if (creditId && creditId !== '') {
        if (report.credit_id !== parseInt(creditId)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Sort by date descending (most recent first)
      return new Date(b.generated_at).getTime() - new Date(a.generated_at).getTime();
    });
  });


  /**
   * Get property name by ID
   */
  getPropertyName(propertyId: number): string {
    const property = this.properties().find(p => p.id === propertyId);
    return property ? `${property.project} - ${property.property_code}` : 'N/A';
  }

  /**
   * Get credit program name by ID
   */
  getCreditName(creditId: number): string {
    const credit = this.credits().find(c => c.id === creditId);
    return credit ? credit.program : 'N/A';
  }

  /**
   * Get currency symbol for a report
   */
  getReportCurrencySymbol(currencyId: number): string {
    return currencyId === 1 ? 'S/' : '$';
  }

  /**
   * Get currency code for a report
   */
  getReportCurrencyCode(currencyId: number): string {
    return currencyId === 1 ? 'PEN' : 'USD';
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.periodFilter.set('');
    this.propertyFilter.set('');
    this.creditFilter.set('');
  }

  /**
   * Download a specific report as PDF
   */
  downloadReport(report: Report): void {
    const property = this.properties().find(p => p.id === report.property_project_id);
    const credit = this.credits().find(c => c.id === report.credit_id);
    const payments = this.financialStore.payments().filter(p => p.report_id === report.id);

    const currencySymbol = this.getReportCurrencySymbol(report.currency_catalog_id);
    const currentLang = this.translate.currentLang || 'es';

    // Create PDF
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;

    // Colors
    const primaryColor: [number, number, number] = [0, 0, 92]; // #00005C
    const secondaryColor: [number, number, number] = [255, 165, 0]; // #FFA500
    const grayColor: [number, number, number] = [128, 128, 128];

    // Helper function to get translation
    const t = (key: string): string => {
      return this.translate.instant(key);
    };

    // Helper function to format currency
    const formatCurrency = (amount: number): string => {
      return `${currencySymbol} ${amount.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // ===== HEADER =====
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(10, 10, pageWidth - 20, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(t('reports.pdf.title'), pageWidth / 2, 22, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`CrediVivienda - ${t('reports.reportNumber')} #${report.id}`, pageWidth / 2, 30, { align: 'center' });
    doc.text(`${t('reports.pdf.generated')}: ${this.formatDate(report.generated_at)}`, pageWidth / 2, 38, { align: 'center' });

    yPos = 55;

    // ===== GENERAL INFORMATION =====
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(t('reports.pdf.generalInfo'), 15, yPos);

    doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.setLineWidth(1);
    doc.line(15, yPos + 2, pageWidth - 15, yPos + 2);

    yPos += 10;

    // General info table
    const generalData = [
      [t('reports.pdf.property'), property?.project || 'N/A'],
      [t('reports.pdf.creditProgram'), credit?.program || 'N/A'],
      [t('reports.pdf.propertyPrice'), formatCurrency(report.price)],
      [t('reports.pdf.downPayment'), formatCurrency(report.down_payment)],
      [t('reports.pdf.bondApplied'), formatCurrency(report.bond_applied)],
      [t('reports.pdf.term'), `${report.years} ${t('reports.card.years')} (${report.years * 12} ${t('reports.pdf.months')})`],
      [t('reports.pdf.frequency'), report.frequency],
      [t('reports.pdf.baseTea'), `${report.base_tea.toFixed(2)}%`]
    ];

    autoTable(doc, {
      startY: yPos,
      head: [],
      body: generalData,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [247, 247, 247], textColor: primaryColor },
        1: { textColor: [30, 30, 30] }
      },
      margin: { left: 15, right: 15 }
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // ===== CREDIT COSTS =====
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(t('reports.pdf.creditCosts'), 15, yPos);

    doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.line(15, yPos + 2, pageWidth - 15, yPos + 2);

    yPos += 10;

    // Costs table
    const costsData = [
      [t('reports.pdf.notary'), formatCurrency(report.notary)],
      [t('reports.pdf.registry'), formatCurrency(report.registry)],
      [t('reports.pdf.appraisal'), formatCurrency(report.appraisal)],
      [t('reports.pdf.studyCommission'), formatCurrency(report.study_commission)],
      [t('reports.pdf.activationCommission'), formatCurrency(report.activation_commission)],
      [t('reports.pdf.insurance'), `${report.life_insurance_annual_rate.toFixed(2)}% + ${report.risk_insurance_annual_rate.toFixed(2)}%`]
    ];

    autoTable(doc, {
      startY: yPos,
      head: [],
      body: costsData,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [247, 247, 247], textColor: primaryColor },
        1: { textColor: [30, 30, 30] }
      },
      margin: { left: 15, right: 15 }
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // Check if we need a new page
    if (yPos > 220) {
      doc.addPage();
      yPos = 20;
    }

    // ===== FINANCIAL METRICS =====
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(t('reports.pdf.financialMetrics'), 15, yPos);

    doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.line(15, yPos + 2, pageWidth - 15, yPos + 2);

    yPos += 10;

    // Metrics boxes
    const boxWidth = (pageWidth - 40) / 3;
    const boxHeight = 25;

    // VAN box
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.roundedRect(15, yPos, boxWidth - 2, boxHeight, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('VAN (NPV)', 15 + boxWidth / 2 - 2, yPos + 8, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(report.van), 15 + boxWidth / 2 - 2, yPos + 18, { align: 'center' });

    // TIR box
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.roundedRect(15 + boxWidth, yPos, boxWidth - 2, boxHeight, 3, 3, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('TIR (IRR)', 15 + boxWidth * 1.5 - 2, yPos + 8, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${(report.tir * 100).toFixed(2)}%`, 15 + boxWidth * 1.5 - 2, yPos + 18, { align: 'center' });

    // TCEA box
    doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.roundedRect(15 + boxWidth * 2, yPos, boxWidth - 2, boxHeight, 3, 3, 'F');
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('TCEA', 15 + boxWidth * 2.5 - 2, yPos + 8, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${(report.tcea * 100).toFixed(2)}%`, 15 + boxWidth * 2.5 - 2, yPos + 18, { align: 'center' });

    yPos += boxHeight + 15;

    // ===== PAYMENT SUMMARY =====
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(t('reports.pdf.paymentSummary'), 15, yPos);

    doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.line(15, yPos + 2, pageWidth - 15, yPos + 2);

    yPos += 10;

    const summaryData = [
      [t('reports.pdf.totalInstallments'), formatCurrency(report.total_installments_paid)],
      [t('reports.pdf.totalAmortization'), formatCurrency(report.total_amortization)],
      [t('reports.pdf.totalInterest'), formatCurrency(report.total_interest)],
      [t('reports.pdf.totalPayments'), formatCurrency(report.total_payments_report)]
    ];

    autoTable(doc, {
      startY: yPos,
      head: [],
      body: summaryData,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [247, 247, 247], textColor: primaryColor },
        1: { textColor: [30, 30, 30] }
      },
      margin: { left: 15, right: 15 }
    });

    yPos = (doc as any).lastAutoTable.finalY + 15;

    // ===== PAYMENT SCHEDULE (ALL PAYMENTS) =====
    if (payments.length > 0) {
      // Add new page for payment schedule
      doc.addPage();
      yPos = 20;

      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(t('reports.pdf.paymentSchedule'), 15, yPos);

      doc.setDrawColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
      doc.line(15, yPos + 2, pageWidth - 15, yPos + 2);

      yPos += 10;

      // Prepare payment schedule data
      const scheduleData = payments.map(payment => [
        payment.period.toString(),
        payment.grace_type === 'TOTAL' ? 'T' : payment.grace_type === 'PARCIAL' ? 'P' : '-',
        formatCurrency(payment.initial_balance),
        formatCurrency(payment.interest_paid),
        formatCurrency(payment.capital_amortization),
        formatCurrency(payment.total_payment),
        formatCurrency(payment.remaining_balance)
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [[
          t('reports.pdf.period'),
          t('reports.pdf.grace'),
          t('reports.pdf.initialBalance'),
          t('reports.pdf.interest'),
          t('reports.pdf.amortization'),
          t('reports.pdf.installment'),
          t('reports.pdf.finalBalance')
        ]],
        body: scheduleData,
        theme: 'striped',
        styles: {
          fontSize: 7,
          cellPadding: 2
        },
        headStyles: {
          fillColor: primaryColor,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center'
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 15 },
          1: { halign: 'center', cellWidth: 12 },
          2: { halign: 'right', cellWidth: 28 },
          3: { halign: 'right', cellWidth: 25 },
          4: { halign: 'right', cellWidth: 28 },
          5: { halign: 'right', cellWidth: 25 },
          6: { halign: 'right', cellWidth: 28 }
        },
        margin: { left: 15, right: 15, bottom: 30 }
      });
    }

    // ===== FOOTER ON ALL PAGES =====
    const totalPages = doc.getNumberOfPages();
    const footerY = doc.internal.pageSize.getHeight() - 25;

    // Draw footer on each page
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);

      // Footer line
      doc.setDrawColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.setLineWidth(0.5);
      doc.line(15, footerY, pageWidth - 15, footerY);

      // Company name
      doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('CrediVivienda', pageWidth / 2, footerY + 6, { align: 'center' });

      // Auto generated text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(t('reports.pdf.autoGenerated'), pageWidth / 2, footerY + 11, { align: 'center' });

      // Print date and page number
      const pageInfo = `${t('reports.pdf.page')} ${i} ${t('reports.pdf.of')} ${totalPages} | ${t('reports.pdf.printDate')}: ${new Date().toLocaleString(currentLang === 'es' ? 'es-PE' : 'en-US')}`;
      doc.text(pageInfo, pageWidth / 2, footerY + 16, { align: 'center' });
    }

    // Save PDF
    const fileName = `reporte-credito-${report.id}-${Date.now()}.pdf`;
    doc.save(fileName);
  }
}
