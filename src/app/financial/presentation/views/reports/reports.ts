import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

interface ChartData {
  month: string;
  value: number;
}

@Component({
  selector: 'app-reports',
  imports: [ReactiveFormsModule, TranslateModule, CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Reports {
  /**
   * Form builder service
   * @private
   */
  private readonly fb = new FormBuilder();

  /**
   * Reports form
   */
  readonly reportsForm: FormGroup = this.fb.group({
    period: ['', Validators.required],
    project: ['', Validators.required],
    reportType: ['', Validators.required]
  });

  /**
   * Mock chart data for simulated credits per month
   */
  readonly chartData = signal<ChartData[]>([
    { month: 'reports.chart.months.january', value: 40 },
    { month: 'reports.chart.months.february', value: 50 },
    { month: 'reports.chart.months.march', value: 30 }
  ]);

  /**
   * Calculate the maximum value for chart scaling
   */
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

  /**
   * Calculate bar height percentage
   */
  getBarHeight(value: number): number {
    return (value / this.maxChartValue()) * 100;
  }

  /**
   * Download report (placeholder)
   */
  onDownload(): void {
    if (this.reportsForm.valid) {
      console.log('Downloading report with data:', this.reportsForm.value);
      this.generatePDF();
    }
  }

  /**
   * Generate PDF report
   */
  private generatePDF(): void {
    const { period, project, reportType } = this.reportsForm.value;

    // Create a simple HTML template for the PDF
    const reportContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Reporte - CrediVivienda</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            margin: 40px;
            color: #1E1E1E;
          }
          .header {
            background-color: #00005C;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .info-section {
            margin-bottom: 30px;
          }
          .info-row {
            display: flex;
            padding: 10px 0;
            border-bottom: 1px solid #E0E0E0;
          }
          .info-label {
            font-weight: bold;
            width: 200px;
            color: #00005C;
          }
          .info-value {
            flex: 1;
          }
          .chart-section {
            margin-top: 40px;
          }
          .chart-title {
            font-size: 20px;
            color: #00005C;
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background-color: #00005C;
            color: white;
            padding: 12px;
            text-align: left;
          }
          td {
            padding: 10px 12px;
            border-bottom: 1px solid #E0E0E0;
          }
          tr:nth-child(even) {
            background-color: #F7F7F7;
          }
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #00005C;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>CrediVivienda - Reporte de Créditos</h1>
        </div>

        <div class="info-section">
          <div class="info-row">
            <div class="info-label">Periodo:</div>
            <div class="info-value">${period}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Proyecto:</div>
            <div class="info-value">${project}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Tipo de Reporte:</div>
            <div class="info-value">${reportType}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Fecha de Generación:</div>
            <div class="info-value">${new Date().toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</div>
          </div>
        </div>

        <div class="chart-section">
          <h2 class="chart-title">Créditos Simulados por Mes</h2>
          <table>
            <thead>
              <tr>
                <th>Mes</th>
                <th>Créditos Simulados</th>
              </tr>
            </thead>
            <tbody>
              ${this.chartData().map(item => `
                <tr>
                  <td>${item.month.split('.').pop()}</td>
                  <td>${item.value}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>CrediVivienda © ${new Date().getFullYear()} - Reporte generado automáticamente</p>
        </div>
      </body>
      </html>
    `;

    // Create a blob and download
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reporte-credivivienda-${Date.now()}.html`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
