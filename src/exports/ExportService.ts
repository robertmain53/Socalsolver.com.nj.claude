/**
 * Advanced Export System
 * Multi-format exports with customization and premium features
 */

import { IUser } from '../users/models/User';
import { ICalculationHistory } from '../history/CalculationHistory';
import PDFDocument from 'pdfkit';
import ExcelJS from 'exceljs';

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  template?: 'professional' | 'minimal' | 'detailed' | 'custom';
  branding?: boolean;
  includeCharts?: boolean;
  customization?: {
    logo?: string;
    colors?: {
      primary: string;
      secondary: string;
    };
    fonts?: {
      heading: string;
      body: string;
    };
  };
  filters?: {
    dateRange?: {
      start: Date;
      end: Date;
    };
    calculators?: string[];
    tags?: string[];
  };
}

export class ExportService {
  
  async exportCalculationHistory(
    user: IUser, 
    calculations: ICalculationHistory[], 
    options: ExportOptions
  ): Promise<Buffer> {
    
    switch (options.format) {
      case 'pdf':
        return this.exportToPDF(user, calculations, options);
      case 'excel':
        return this.exportToExcel(user, calculations, options);
      case 'csv':
        return this.exportToCSV(calculations, options);
      case 'json':
        return this.exportToJSON(calculations, options);
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }
  
  async exportSingleCalculation(
    calculation: ICalculationHistory,
    options: ExportOptions
  ): Promise<Buffer> {
    
    return this.exportCalculationHistory(
      null as any, // User not needed for single calculation
      [calculation],
      options
    );
  }
  
  private async exportToPDF(
    user: IUser,
    calculations: ICalculationHistory[],
    options: ExportOptions
  ): Promise<Buffer> {
    
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: 'Calculation Report',
        Author: 'Calculator Platform',
        Subject: 'Calculation History Export',
        Creator: 'Calculator Platform Export Service'
      }
    });
    
    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    
    // Add header with branding
    if (options.branding !== false) {
      await this.addPDFHeader(doc, user, options);
    }
    
    // Add title
    doc.fontSize(24)
       .fillColor('#2563eb')
       .text('Calculation Report', 50, doc.y, { align: 'center' });
    
    doc.moveDown(2);
    
    // Add summary section
    await this.addPDFSummary(doc, calculations);
    
    // Add calculations
    for (const [index, calculation] of calculations.entries()) {
      if (index > 0) {
        doc.addPage();
      }
      await this.addPDFCalculation(doc, calculation, options);
    }
    
    // Add charts if requested and user has premium
    if (options.includeCharts && user?.tier !== 'free') {
      doc.addPage();
      await this.addPDFCharts(doc, calculations);
    }
    
    // Add footer
    await this.addPDFFooter(doc, options);
    
    doc.end();
    
    return new Promise((resolve) => {
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
    });
  }
  
  private async exportToExcel(
    user: IUser,
    calculations: ICalculationHistory[],
    options: ExportOptions
  ): Promise<Buffer> {
    
    const workbook = new ExcelJS.Workbook();
    
    // Set workbook properties
    workbook.creator = 'Calculator Platform';
    workbook.created = new Date();
    workbook.modified = new Date();
    
    // Summary worksheet
    const summarySheet = workbook.addWorksheet('Summary');
    await this.createExcelSummary(summarySheet, calculations, user);
    
    // Calculations worksheet
    const calculationsSheet = workbook.addWorksheet('Calculations');
    await this.createExcelCalculations(calculationsSheet, calculations);
    
    // Analytics worksheet (premium feature)
    if (user?.tier !== 'free') {
      const analyticsSheet = workbook.addWorksheet('Analytics');
      await this.createExcelAnalytics(analyticsSheet, calculations);
    }
    
    // Charts worksheet (premium feature)
    if (options.includeCharts && user?.tier !== 'free') {
      const chartsSheet = workbook.addWorksheet('Charts');
      await this.createExcelCharts(chartsSheet, calculations);
    }
    
    return workbook.xlsx.writeBuffer() as Promise<Buffer>;
  }
  
  private exportToCSV(
    calculations: ICalculationHistory[],
    options: ExportOptions
  ): Buffer {
    
    const headers = [
      'Date',
      'Calculator',
      'Inputs',
      'Outputs',
      'Calculation Time (ms)',
      'Cached',
      'Notes',
      'Tags'
    ];
    
    const rows = calculations.map(calc => [
      calc.timestamp.toISOString(),
      calc.calculatorName,
      JSON.stringify(calc.inputs),
      JSON.stringify(calc.outputs),
      calc.calculationTime?.toString() || '',
      calc.cacheHit?.toString() || 'false',
      calc.notes || '',
      calc.tags.join(';')
    ]);
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    return Buffer.from(csvContent, 'utf-8');
  }
  
  private exportToJSON(
    calculations: ICalculationHistory[],
    options: ExportOptions
  ): Buffer {
    
    const exportData = {
      exportDate: new Date().toISOString(),
      format: 'json',
      version: '2.0',
      totalCalculations: calculations.length,
      filters: options.filters,
      calculations: calculations.map(calc => ({
        id: calc._id,
        timestamp: calc.timestamp,
        calculator: {
          id: calc.calculatorId,
          name: calc.calculatorName
        },
        inputs: calc.inputs,
        outputs: calc.outputs,
        formattedOutputs: calc.formattedOutputs,
        metadata: {
          calculationTime: calc.calculationTime,
          cacheHit: calc.cacheHit,
          apiVersion: calc.apiVersion,
          sessionId: calc.sessionId
        },
        organization: {
          tags: calc.tags,
          notes: calc.notes,
          isBookmarked: calc.isBookmarked
        },
        exports: calc.exports
      }))
    };
    
    return Buffer.from(JSON.stringify(exportData, null, 2), 'utf-8');
  }
  
  // PDF Helper Methods
  private async addPDFHeader(doc: PDFKit.PDFDocument, user: IUser, options: ExportOptions): Promise<void> {
    const logoPath = options.customization?.logo || 'assets/logo.png';
    
    try {
      // Add logo if available
      doc.image(logoPath, 50, 30, { width: 100 });
    } catch (error) {
      // Fallback if logo not found
      doc.fontSize(16)
         .fillColor('#2563eb')
         .text('Calculator Platform', 50, 50);
    }
    
    // Add user info
    if (user) {
      doc.fontSize(10)
         .fillColor('#6b7280')
         .text(`Generated for: ${user.name || user.email}`, 200, 50)
         .text(`Date: ${new Date().toLocaleDateString()}`, 200, 65)
         .text(`Plan: ${user.tier.toUpperCase()}`, 200, 80);
    }
    
    doc.moveDown(3);
  }
  
  private async addPDFSummary(doc: PDFKit.PDFDocument, calculations: ICalculationHistory[]): Promise<void> {
    const totalCalculations = calculations.length;
    const uniqueCalculators = new Set(calculations.map(c => c.calculatorId)).size;
    const totalTime = calculations.reduce((sum, c) => sum + (c.calculationTime || 0), 0);
    const avgTime = totalTime / totalCalculations;
    const dateRange = calculations.length > 0 ? {
      start: new Date(Math.min(...calculations.map(c => c.timestamp.getTime()))),
      end: new Date(Math.max(...calculations.map(c => c.timestamp.getTime())))
    } : null;
    
    doc.fontSize(16)
       .fillColor('#374151')
       .text('Summary', 50, doc.y);
    
    doc.moveDown();
    
    const summaryData = [
      ['Total Calculations:', totalCalculations.toString()],
      ['Unique Calculators:', uniqueCalculators.toString()],
      ['Average Calculation Time:', `${avgTime.toFixed(2)}ms`],
      ['Date Range:', dateRange ? `${dateRange.start.toLocaleDateString()} - ${dateRange.end.toLocaleDateString()}` : 'N/A']
    ];
    
    summaryData.forEach(([label, value]) => {
      doc.fontSize(10)
         .fillColor('#6b7280')
         .text(label, 70, doc.y, { continued: true })
         .fillColor('#374151')
         .text(` ${value}`);
      doc.moveDown(0.5);
    });
    
    doc.moveDown(2);
  }
  
  private async addPDFCalculation(
    doc: PDFKit.PDFDocument,
    calculation: ICalculationHistory,
    options: ExportOptions
  ): Promise<void> {
    
    // Calculation header
    doc.fontSize(14)
       .fillColor('#1f2937')
       .text(calculation.calculatorName, 50, doc.y);
    
    doc.fontSize(9)
       .fillColor('#6b7280')
       .text(calculation.timestamp.toLocaleString(), 50, doc.y);
    
    doc.moveDown();
    
    // Inputs section
    doc.fontSize(12)
       .fillColor('#374151')
       .text('Inputs:', 50, doc.y);
    
    Object.entries(calculation.inputs).forEach(([key, value]) => {
      doc.fontSize(10)
         .fillColor('#6b7280')
         .text(`  ${key}:`, 70, doc.y, { continued: true })
         .fillColor('#374151')
         .text(` ${this.formatValue(value)}`);
      doc.moveDown(0.3);
    });
    
    doc.moveDown();
    
    // Outputs section
    doc.fontSize(12)
       .fillColor('#374151')
       .text('Results:', 50, doc.y);
    
    Object.entries(calculation.outputs).forEach(([key, value]) => {
      doc.fontSize(10)
         .fillColor('#6b7280')
         .text(`  ${key}:`, 70, doc.y, { continued: true })
         .fillColor('#16a34a')
         .text(` ${this.formatValue(value)}`);
      doc.moveDown(0.3);
    });
    
    // Notes if available
    if (calculation.notes) {
      doc.moveDown();
      doc.fontSize(12)
         .fillColor('#374151')
         .text('Notes:', 50, doc.y);
      doc.fontSize(10)
         .fillColor('#6b7280')
         .text(calculation.notes, 70, doc.y, { width: 450 });
    }
    
    // Tags if available
    if (calculation.tags.length > 0) {
      doc.moveDown();
      doc.fontSize(12)
         .fillColor('#374151')
         .text('Tags:', 50, doc.y);
      doc.fontSize(10)
         .fillColor('#6b7280')
         .text(calculation.tags.join(', '), 70, doc.y);
    }
  }
  
  private async addPDFCharts(doc: PDFKit.PDFDocument, calculations: ICalculationHistory[]): Promise<void> {
    doc.fontSize(16)
       .fillColor('#374151')
       .text('Analytics Charts', 50, doc.y);
    
    doc.moveDown();
    
    // This would generate actual charts in a real implementation
    doc.fontSize(10)
       .fillColor('#6b7280')
       .text('Chart generation requires additional dependencies and is available in the full implementation.', 50, doc.y);
  }
  
  private async addPDFFooter(doc: PDFKit.PDFDocument, options: ExportOptions): Promise<void> {
    const pages = doc.bufferedPageRange();
    
    for (let i = 0; i < pages.count; i++) {
      doc.switchToPage(i);
      
      doc.fontSize(8)
         .fillColor('#9ca3af')
         .text(
           `Generated by Calculator Platform | Page ${i + 1} of ${pages.count}`,
           50,
           doc.page.height - 50,
           { align: 'center' }
         );
    }
  }
  
  // Excel Helper Methods
  private async createExcelSummary(
    worksheet: ExcelJS.Worksheet,
    calculations: ICalculationHistory[],
    user: IUser
  ): Promise<void> {
    
    worksheet.columns = [
      { key: 'metric', header: 'Metric', width: 25 },
      { key: 'value', header: 'Value', width: 20 }
    ];
    
    const summaryData = [
      { metric: 'Total Calculations', value: calculations.length },
      { metric: 'Unique Calculators', value: new Set(calculations.map(c => c.calculatorId)).size },
      { metric: 'Date Range', value: this.getDateRange(calculations) },
      { metric: 'Export Date', value: new Date().toISOString() },
      { metric: 'User Tier', value: user?.tier?.toUpperCase() || 'N/A' }
    ];
    
    worksheet.addRows(summaryData);
    
    // Style the header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE5E7EB' }
    };
  }
  
  private async createExcelCalculations(
    worksheet: ExcelJS.Worksheet,
    calculations: ICalculationHistory[]
  ): Promise<void> {
    
    worksheet.columns = [
      { key: 'date', header: 'Date', width: 20 },
      { key: 'calculator', header: 'Calculator', width: 25 },
      { key: 'inputs', header: 'Inputs', width: 40 },
      { key: 'outputs', header: 'Results', width: 40 },
      { key: 'time', header: 'Time (ms)', width: 12 },
      { key: 'cached', header: 'Cached', width: 10 },
      { key: 'notes', header: 'Notes', width: 30 },
      { key: 'tags', header: 'Tags', width: 20 }
    ];
    
    const rows = calculations.map(calc => ({
      date: calc.timestamp.toISOString(),
      calculator: calc.calculatorName,
      inputs: JSON.stringify(calc.inputs),
      outputs: JSON.stringify(calc.outputs),
      time: calc.calculationTime || 0,
      cached: calc.cacheHit || false,
      notes: calc.notes || '',
      tags: calc.tags.join(', ')
    }));
    
    worksheet.addRows(rows);
    
    // Style the header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE5E7EB' }
    };
  }
  
  private async createExcelAnalytics(
    worksheet: ExcelJS.Worksheet,
    calculations: ICalculationHistory[]
  ): Promise<void> {
    
    // Calculator usage analysis
    const usage = new Map<string, number>();
    calculations.forEach(calc => {
      usage.set(calc.calculatorId, (usage.get(calc.calculatorId) || 0) + 1);
    });
    
    worksheet.columns = [
      { key: 'calculator', header: 'Calculator', width: 25 },
      { key: 'usage', header: 'Usage Count', width: 15 },
      { key: 'percentage', header: 'Percentage', width: 15 }
    ];
    
    const total = calculations.length;
    const analyticsData = Array.from(usage.entries()).map(([calculator, count]) => ({
      calculator,
      usage: count,
      percentage: `${((count / total) * 100).toFixed(1)}%`
    }));
    
    worksheet.addRows(analyticsData);
    
    // Style the header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE5E7EB' }
    };
  }
  
  private async createExcelCharts(
    worksheet: ExcelJS.Worksheet,
    calculations: ICalculationHistory[]
  ): Promise<void> {
    
    worksheet.addRow(['Charts would be generated here with additional chart libraries']);
  }
  
  // Utility methods
  private formatValue(value: any): string {
    if (typeof value === 'number') {
      return value.toLocaleString();
    }
    return value?.toString() || '';
  }
  
  private getDateRange(calculations: ICalculationHistory[]): string {
    if (calculations.length === 0) return 'N/A';
    
    const dates = calculations.map(c => c.timestamp.getTime());
    const start = new Date(Math.min(...dates));
    const end = new Date(Math.max(...dates));
    
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  }
}

// Export singleton instance
export const exportService = new ExportService();
