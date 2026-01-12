import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { KeywordData, HistoricalData } from './forecasting';

export interface ParsedKeywordData {
  data: KeywordData[];
  errors: string[];
}

export interface ParsedHistoricalData {
  data: HistoricalData[];
  errors: string[];
}

export function parseKeywordCSV(file: File): Promise<ParsedKeywordData> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data: KeywordData[] = [];
        const errors: string[] = [];
        
        (results.data as Record<string, string>[]).forEach((row, index) => {
          try {
            const keyword = row.keyword || row.Keyword || row.KEYWORD || '';
            const currentPosition = parseFloat(
              row.currentPosition || row['Current Position'] || row.current_position || '0'
            );
            const targetPosition = parseFloat(
              row.targetPosition || row['Target Position'] || row.target_position || '0'
            );
            const searchVolume = parseFloat(
              row.searchVolume || row['Search Volume'] || row.search_volume || '0'
            );
            const currentCTR = row.currentCTR || row['Current CTR'] || row.current_ctr
              ? parseFloat(row.currentCTR || row['Current CTR'] || row.current_ctr)
              : undefined;
            
            if (!keyword) {
              errors.push(`Row ${index + 1}: Missing keyword`);
              return;
            }
            
            if (isNaN(currentPosition) || currentPosition < 1 || currentPosition > 100) {
              errors.push(`Row ${index + 1}: Invalid current position for "${keyword}"`);
              return;
            }
            
            if (isNaN(targetPosition) || targetPosition < 1 || targetPosition > 100) {
              errors.push(`Row ${index + 1}: Invalid target position for "${keyword}"`);
              return;
            }
            
            if (isNaN(searchVolume) || searchVolume < 0) {
              errors.push(`Row ${index + 1}: Invalid search volume for "${keyword}"`);
              return;
            }
            
            data.push({
              keyword: keyword.trim(),
              currentPosition: Math.round(currentPosition),
              targetPosition: Math.round(targetPosition),
              searchVolume: Math.round(searchVolume),
              currentCTR,
            });
          } catch (error) {
            errors.push(`Row ${index + 1}: Parse error - ${error}`);
          }
        });
        
        resolve({ data, errors });
      },
      error: (error) => {
        resolve({ data: [], errors: [error.message] });
      },
    });
  });
}

export function parseKeywordExcel(file: File): Promise<ParsedKeywordData> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        
        const keywords: KeywordData[] = [];
        const errors: string[] = [];
        
        (jsonData as Record<string, string | number>[]).forEach((row, index) => {
          try {
            const keyword = String(row.keyword || row.Keyword || row.KEYWORD || '');
            const currentPosition = parseFloat(
              String(row.currentPosition || row['Current Position'] || row.current_position || '0')
            );
            const targetPosition = parseFloat(
              String(row.targetPosition || row['Target Position'] || row.target_position || '0')
            );
            const searchVolume = parseFloat(
              String(row.searchVolume || row['Search Volume'] || row.search_volume || '0')
            );
            const currentCTR = row.currentCTR || row['Current CTR'] || row.current_ctr
              ? parseFloat(String(row.currentCTR || row['Current CTR'] || row.current_ctr))
              : undefined;
            
            if (!keyword) {
              errors.push(`Row ${index + 1}: Missing keyword`);
              return;
            }
            
            if (isNaN(currentPosition) || currentPosition < 1 || currentPosition > 100) {
              errors.push(`Row ${index + 1}: Invalid current position for "${keyword}"`);
              return;
            }
            
            if (isNaN(targetPosition) || targetPosition < 1 || targetPosition > 100) {
              errors.push(`Row ${index + 1}: Invalid target position for "${keyword}"`);
              return;
            }
            
            if (isNaN(searchVolume) || searchVolume < 0) {
              errors.push(`Row ${index + 1}: Invalid search volume for "${keyword}"`);
              return;
            }
            
            keywords.push({
              keyword: keyword.trim(),
              currentPosition: Math.round(currentPosition),
              targetPosition: Math.round(targetPosition),
              searchVolume: Math.round(searchVolume),
              currentCTR,
            });
          } catch (error) {
            errors.push(`Row ${index + 1}: Parse error - ${error}`);
          }
        });
        
        resolve({ data: keywords, errors });
      } catch (error) {
        resolve({ data: [], errors: [`Failed to parse Excel file: ${error}`] });
      }
    };
    
    reader.onerror = () => {
      resolve({ data: [], errors: ['Failed to read file'] });
    };
    
    reader.readAsArrayBuffer(file);
  });
}

export function parseHistoricalCSV(file: File): Promise<ParsedHistoricalData> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const data: HistoricalData[] = [];
        const errors: string[] = [];
        
        (results.data as Record<string, string>[]).forEach((row, index) => {
          try {
            const date = row.date || row.Date || row.DATE || '';
            const sessions = parseFloat(
              row.sessions || row.Sessions || row.SESSIONS || '0'
            );
            const conversions = parseFloat(
              row.conversions || row.Conversions || row.CONVERSIONS || '0'
            );
            
            if (!date) {
              errors.push(`Row ${index + 1}: Missing date`);
              return;
            }
            
            if (isNaN(sessions) || sessions < 0) {
              errors.push(`Row ${index + 1}: Invalid sessions value`);
              return;
            }
            
            if (isNaN(conversions) || conversions < 0) {
              errors.push(`Row ${index + 1}: Invalid conversions value`);
              return;
            }
            
            data.push({
              date: date.trim(),
              sessions: Math.round(sessions),
              conversions: Math.round(conversions),
            });
          } catch (error) {
            errors.push(`Row ${index + 1}: Parse error - ${error}`);
          }
        });
        
        resolve({ data, errors });
      },
      error: (error) => {
        resolve({ data: [], errors: [error.message] });
      },
    });
  });
}

export function parseHistoricalExcel(file: File): Promise<ParsedHistoricalData> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        
        const historicalData: HistoricalData[] = [];
        const errors: string[] = [];
        
        (jsonData as Record<string, string | number>[]).forEach((row, index) => {
          try {
            const date = String(row.date || row.Date || row.DATE || '');
            const sessions = parseFloat(
              String(row.sessions || row.Sessions || row.SESSIONS || '0')
            );
            const conversions = parseFloat(
              String(row.conversions || row.Conversions || row.CONVERSIONS || '0')
            );
            
            if (!date) {
              errors.push(`Row ${index + 1}: Missing date`);
              return;
            }
            
            if (isNaN(sessions) || sessions < 0) {
              errors.push(`Row ${index + 1}: Invalid sessions value`);
              return;
            }
            
            if (isNaN(conversions) || conversions < 0) {
              errors.push(`Row ${index + 1}: Invalid conversions value`);
              return;
            }
            
            historicalData.push({
              date: date.toString().trim(),
              sessions: Math.round(sessions),
              conversions: Math.round(conversions),
            });
          } catch (error) {
            errors.push(`Row ${index + 1}: Parse error - ${error}`);
          }
        });
        
        resolve({ data: historicalData, errors });
      } catch (error) {
        resolve({ data: [], errors: [`Failed to parse Excel file: ${error}`] });
      }
    };
    
    reader.onerror = () => {
      resolve({ data: [], errors: ['Failed to read file'] });
    };
    
    reader.readAsArrayBuffer(file);
  });
}
