import * as XLSX from 'xlsx';
import { ForecastResult, KeywordImpact } from './forecasting';

export function generateCSV(forecasts: ForecastResult[], includeRevenue: boolean): string {
  const headers = [
    'Month',
    'Conservative Sessions',
    'Expected Sessions',
    'Optimistic Sessions',
    'Conservative Conversions',
    'Expected Conversions',
    'Optimistic Conversions',
  ];
  
  if (includeRevenue) {
    headers.push(
      'Conservative Revenue',
      'Expected Revenue',
      'Optimistic Revenue'
    );
  }
  
  const rows = forecasts.map(f => {
    const row = [
      f.month.toString(),
      f.conservativeSessions.toString(),
      f.expectedSessions.toString(),
      f.optimisticSessions.toString(),
      f.conservativeConversions.toString(),
      f.expectedConversions.toString(),
      f.optimisticConversions.toString(),
    ];
    
    if (includeRevenue && f.conservativeRevenue !== undefined) {
      row.push(
        f.conservativeRevenue.toString(),
        f.expectedRevenue?.toString() || '0',
        f.optimisticRevenue?.toString() || '0'
      );
    }
    
    return row;
  });
  
  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  return csvContent;
}

export function generateExcel(
  forecasts: ForecastResult[],
  includeRevenue: boolean,
  methodology: string,
  caveats: string[],
  keywordImpact?: KeywordImpact[]
): ArrayBuffer {
  const wb = XLSX.utils.book_new();
  
  const forecastData = forecasts.map(f => {
    const row: Record<string, number> = {
      'Month': f.month,
      'Conservative Sessions': f.conservativeSessions,
      'Expected Sessions': f.expectedSessions,
      'Optimistic Sessions': f.optimisticSessions,
      'Conservative Conversions': f.conservativeConversions,
      'Expected Conversions': f.expectedConversions,
      'Optimistic Conversions': f.optimisticConversions,
    };
    
    if (includeRevenue && f.conservativeRevenue !== undefined) {
      row['Conservative Revenue'] = f.conservativeRevenue;
      row['Expected Revenue'] = f.expectedRevenue || 0;
      row['Optimistic Revenue'] = f.optimisticRevenue || 0;
    }
    
    return row;
  });
  
  const ws = XLSX.utils.json_to_sheet(forecastData);
  
  const colWidths = [
    { wch: 8 },
    { wch: 20 },
    { wch: 18 },
    { wch: 20 },
    { wch: 24 },
    { wch: 22 },
    { wch: 24 },
  ];
  
  if (includeRevenue) {
    colWidths.push({ wch: 20 }, { wch: 18 }, { wch: 20 });
  }
  
  ws['!cols'] = colWidths;
  
  XLSX.utils.book_append_sheet(wb, ws, 'Monthly Forecast');

  if (keywordImpact && keywordImpact.length > 0) {
    const impactData = keywordImpact.map(ki => ({
      'Keyword': ki.keyword,
      'Current Position': ki.currentPosition,
      'Forecast Position': ki.forecastPosition,
      'Search Volume': ki.searchVolume,
      'Estimated Monthly Lift': ki.estimatedMonthlySessions,
      'Contribution %': ki.contributionPercentage.toFixed(2) + '%'
    }));
    const wsImpact = XLSX.utils.json_to_sheet(impactData);
    wsImpact['!cols'] = [
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 }
    ];
    XLSX.utils.book_append_sheet(wb, wsImpact, 'Keyword Impact');
  }
  
  const summaryData = [
    ['SEO FORECAST SUMMARY'],
    [''],
    ['Total Projected Sessions (Expected):', forecasts.reduce((sum, f) => sum + f.expectedSessions, 0)],
    ['Total Projected Conversions (Expected):', forecasts.reduce((sum, f) => sum + f.expectedConversions, 0)],
  ];
  
  if (includeRevenue && forecasts[0].expectedRevenue !== undefined) {
    summaryData.push([
      'Total Projected Revenue (Expected):',
      forecasts.reduce((sum, f) => sum + (f.expectedRevenue || 0), 0)
    ]);
  }
  
  summaryData.push([''], ['METHODOLOGY'], ['']);
  
  const methodologyLines = methodology.split('\n').map(line => [line]);
  summaryData.push(...methodologyLines);
  
  summaryData.push([''], ['CAVEATS & RISK FACTORS'], ['']);
  caveats.forEach(caveat => {
    summaryData.push([`• ${caveat}`]);
  });
  
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  wsSummary['!cols'] = [{ wch: 50 }, { wch: 20 }];
  
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');
  
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return wbout;
}

export function downloadFile(content: string | ArrayBuffer, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
