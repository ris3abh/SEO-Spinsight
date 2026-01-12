'use client';

import { useState } from 'react';
import FileUpload from './components/FileUpload';
import ForecastResults from './components/ForecastResults';
import {
  KeywordData,
  HistoricalData,
  ProjectParameters,
  ForecastResult,
  generateForecast,
  generateCaveats,
  generateMethodologyText,
  validateInputData,
} from '@/lib/forecasting';
import {
  parseKeywordCSV,
  parseKeywordExcel,
  parseHistoricalCSV,
  parseHistoricalExcel,
} from '@/lib/parser';
import { generateCSV, generateExcel, downloadFile } from '@/lib/export';

export default function Home() {
  const [keywordData, setKeywordData] = useState<KeywordData[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [timelineMonths, setTimelineMonths] = useState<number>(12);
  const [effortLevel, setEffortLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [revenuePerConversion, setRevenuePerConversion] = useState<string>('');
  const [forecasts, setForecasts] = useState<ForecastResult[] | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [parseErrors, setParseErrors] = useState<string[]>([]);

  const handleKeywordFileUpload = async (file: File | null) => {
    if (!file) {
      setKeywordData([]);
      return;
    }

    setLoading(true);
    setParseErrors([]);

    try {
      const fileName = file.name.toLowerCase();
      let result;

      if (fileName.endsWith('.csv')) {
        result = await parseKeywordCSV(file);
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        result = await parseKeywordExcel(file);
      } else {
        setParseErrors(['Unsupported file format. Please upload CSV or Excel files.']);
        setLoading(false);
        return;
      }

      if (result.errors.length > 0) {
        setParseErrors(result.errors);
      }

      setKeywordData(result.data);
    } catch (error) {
      setParseErrors([`Failed to parse file: ${error}`]);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoricalFileUpload = async (file: File | null) => {
    if (!file) {
      setHistoricalData([]);
      return;
    }

    setLoading(true);
    setParseErrors([]);

    try {
      const fileName = file.name.toLowerCase();
      let result;

      if (fileName.endsWith('.csv')) {
        result = await parseHistoricalCSV(file);
      } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
        result = await parseHistoricalExcel(file);
      } else {
        setParseErrors(['Unsupported file format. Please upload CSV or Excel files.']);
        setLoading(false);
        return;
      }

      if (result.errors.length > 0) {
        setParseErrors(result.errors);
      }

      setHistoricalData(result.data);
    } catch (error) {
      setParseErrors([`Failed to parse file: ${error}`]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateForecast = () => {
    setErrors([]);
    setForecasts(null);

    const parameters: ProjectParameters = {
      timelineMonths,
      effortLevel,
    };

    const validation = validateInputData(keywordData, historicalData, parameters);

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    if (validation.errors.length > 0) {
      setErrors(validation.errors);
    }

    try {
      const revenue = revenuePerConversion ? parseFloat(revenuePerConversion) : undefined;
      const results = generateForecast(keywordData, historicalData, parameters, revenue);
      setForecasts(results);
    } catch (error) {
      setErrors([`Failed to generate forecast: ${error}`]);
    }
  };

  // Calculate baseline sessions for display
  const baselineSessions = historicalData && historicalData.length > 0
    ? historicalData[historicalData.length - 1].sessions
    : undefined;

  const handleExportCSV = () => {
    if (!forecasts) return;

    const includeRevenue = !!revenuePerConversion && parseFloat(revenuePerConversion) > 0;
    const csv = generateCSV(forecasts, includeRevenue);
    downloadFile(csv, 'seo-forecast.csv', 'text/csv');
  };

  const handleExportExcel = () => {
    if (!forecasts) return;

    const includeRevenue = !!revenuePerConversion && parseFloat(revenuePerConversion) > 0;
    const parameters: ProjectParameters = { timelineMonths, effortLevel };
    const caveats = generateCaveats(keywordData, parameters);
    const methodology = generateMethodologyText();

    const excel = generateExcel(forecasts, includeRevenue, methodology, caveats);
    downloadFile(
      excel,
      'seo-forecast.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            SEO Forecasting Tool
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto">
            Generate reliable, tiered ROI projections for organic search initiatives based on
            your data inputs.
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
            Data Input
          </h2>

          <div className="space-y-6">
            <FileUpload
              label="Keyword Data"
              accept=".csv,.xlsx,.xls"
              onChange={handleKeywordFileUpload}
              helpText="Upload CSV or Excel file with columns: keyword, currentPosition, targetPosition, searchVolume, currentCTR (optional)"
              required
            />

            <FileUpload
              label="Historical Traffic Data"
              accept=".csv,.xlsx,.xls"
              onChange={handleHistoricalFileUpload}
              helpText="Upload CSV or Excel file with columns: date, sessions, conversions (optional - will use 2% default conversion rate if not provided)"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                  Timeline (Months) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="36"
                  value={timelineMonths}
                  onChange={(e) => setTimelineMonths(parseInt(e.target.value) || 12)}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md
                    bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                    focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                  Effort Level <span className="text-red-500">*</span>
                </label>
                <select
                  value={effortLevel}
                  onChange={(e) => setEffortLevel(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md
                    bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                    focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
                  Revenue per Conversion
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={revenuePerConversion}
                  onChange={(e) => setRevenuePerConversion(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md
                    bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100
                    focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>

            {keywordData.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  ✓ Loaded {keywordData.length} keyword{keywordData.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {historicalData.length > 0 && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  ✓ Loaded {historicalData.length} historical data point
                  {historicalData.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}

            {parseErrors.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
                <h3 className="text-sm font-medium text-yellow-900 dark:text-yellow-100 mb-2">
                  Parse Warnings:
                </h3>
                <ul className="list-disc list-inside text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                  {parseErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {errors.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <h3 className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
                  Validation Errors:
                </h3>
                <ul className="list-disc list-inside text-sm text-red-800 dark:text-red-200 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={handleGenerateForecast}
              disabled={loading || keywordData.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700
                text-white font-semibold py-3 px-6 rounded-md
                transition-colors duration-200
                disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : 'Generate Forecast'}
            </button>
          </div>
        </div>

        {forecasts && (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                Forecast Results
              </h2>
              <div className="flex gap-3">
                <button
                  onClick={handleExportCSV}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md
                    transition-colors duration-200"
                >
                  Export CSV
                </button>
                <button
                  onClick={handleExportExcel}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md
                    transition-colors duration-200"
                >
                  Export Excel
                </button>
              </div>
            </div>

            <ForecastResults
              forecasts={forecasts}
              includeRevenue={!!revenuePerConversion && parseFloat(revenuePerConversion) > 0}
              baselineSessions={baselineSessions}
            />
          </div>
        )}

        {forecasts && (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-6">
              Methodology & Caveats
            </h2>

            <div className="prose dark:prose-invert max-w-none">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                  Forecasting Methodology
                </h3>
                <div className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line">
                  {generateMethodologyText()}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                  Caveats & Risk Factors
                </h3>
                <ul className="list-disc list-inside text-sm text-zinc-700 dark:text-zinc-300 space-y-2">
                  {generateCaveats(keywordData, { timelineMonths, effortLevel }).map(
                    (caveat, index) => (
                      <li key={index}>{caveat}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
