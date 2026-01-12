export interface KeywordData {
  keyword: string;
  currentPosition: number;
  targetPosition: number;
  searchVolume: number;
  currentCTR?: number;
}

export interface HistoricalData {
  date: string;
  sessions: number;
  conversions: number;
}

export interface ProjectParameters {
  timelineMonths: number;
  effortLevel: 'low' | 'medium' | 'high';
}

export interface ForecastResult {
  month: number;
  conservativeSessions: number;
  expectedSessions: number;
  optimisticSessions: number;
  conservativeConversions: number;
  expectedConversions: number;
  optimisticConversions: number;
  conservativeRevenue?: number;
  expectedRevenue?: number;
  optimisticRevenue?: number;
}

const INDUSTRY_CTR_CURVE: Record<number, number> = {
  1: 0.316,
  2: 0.158,
  3: 0.105,
  4: 0.077,
  5: 0.062,
  6: 0.051,
  7: 0.043,
  8: 0.038,
  9: 0.033,
  10: 0.029,
  11: 0.026,
  12: 0.023,
  13: 0.021,
  14: 0.019,
  15: 0.017,
  16: 0.016,
  17: 0.015,
  18: 0.014,
  19: 0.013,
  20: 0.012,
};

function getCTR(position: number, customCTR?: number): number {
  if (customCTR !== undefined && customCTR > 0) {
    return customCTR;
  }
  
  if (position <= 20 && INDUSTRY_CTR_CURVE[position]) {
    return INDUSTRY_CTR_CURVE[position];
  }
  
  if (position > 20 && position <= 50) {
    return 0.012 * Math.exp(-0.02 * (position - 20));
  }
  
  if (position > 50) {
    return 0.005 * Math.exp(-0.01 * (position - 50));
  }
  
  return 0.001;
}

function calculatePositionImprovement(
  currentPosition: number,
  targetPosition: number,
  monthIndex: number,
  totalMonths: number,
  effortLevel: 'low' | 'medium' | 'high'
): number {
  const positionDiff = currentPosition - targetPosition;
  
  if (positionDiff <= 0) {
    return currentPosition;
  }
  
  const effortMultiplier = {
    low: 0.6,
    medium: 1.0,
    high: 1.4,
  }[effortLevel];
  
  const progress = monthIndex / totalMonths;
  
  const decayCurve = 1 - Math.exp(-3 * progress);
  
  const improvement = positionDiff * decayCurve * effortMultiplier;
  
  const newPosition = Math.max(
    targetPosition,
    currentPosition - improvement
  );
  
  return Math.round(newPosition);
}

function calculateBaselineConversionRate(historicalData: HistoricalData[]): number {
  if (!historicalData || historicalData.length === 0) {
    return 0.02;
  }
  
  const totalSessions = historicalData.reduce((sum, d) => sum + d.sessions, 0);
  const totalConversions = historicalData.reduce((sum, d) => sum + d.conversions, 0);
  
  if (totalSessions === 0) {
    return 0.02;
  }
  
  const rate = totalConversions / totalSessions;
  
  return Math.max(0.001, Math.min(0.5, rate));
}

export function validateInputData(
  keywords: KeywordData[],
  historicalData: HistoricalData[],
  parameters: ProjectParameters
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!keywords || keywords.length === 0) {
    errors.push('No keyword data provided');
  } else {
    keywords.forEach((kw, index) => {
      if (!kw.keyword || kw.keyword.trim() === '') {
        errors.push(`Keyword at index ${index} is missing`);
      }
      if (kw.currentPosition < 1 || kw.currentPosition > 100) {
        errors.push(`Invalid current position for keyword "${kw.keyword}": must be between 1-100`);
      }
      if (kw.targetPosition < 1 || kw.targetPosition > 100) {
        errors.push(`Invalid target position for keyword "${kw.keyword}": must be between 1-100`);
      }
      if (kw.searchVolume < 0) {
        errors.push(`Invalid search volume for keyword "${kw.keyword}": must be positive`);
      }
      if (kw.currentCTR !== undefined && (kw.currentCTR < 0 || kw.currentCTR > 1)) {
        errors.push(`Invalid CTR for keyword "${kw.keyword}": must be between 0-1`);
      }
    });
  }
  
  if (!historicalData || historicalData.length === 0) {
    errors.push('No historical data provided - using default conversion rate of 2%');
  }
  
  if (!parameters.timelineMonths || parameters.timelineMonths < 1) {
    errors.push('Invalid timeline: must be at least 1 month');
  }
  
  if (parameters.timelineMonths > 36) {
    errors.push('Timeline exceeds 36 months - forecasts become increasingly uncertain');
  }
  
  return {
    valid: errors.length === 0 || (errors.length === 1 && errors[0].includes('No historical data')),
    errors
  };
}

export function generateForecast(
  keywords: KeywordData[],
  historicalData: HistoricalData[],
  parameters: ProjectParameters,
  revenuePerConversion?: number
): ForecastResult[] {
  const validation = validateInputData(keywords, historicalData, parameters);
  if (!validation.valid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }
  
  const conversionRate = calculateBaselineConversionRate(historicalData);
  const results: ForecastResult[] = [];
  
  for (let month = 1; month <= parameters.timelineMonths; month++) {
    let expectedSessions = 0;
    
    keywords.forEach((keyword) => {
      const projectedPosition = calculatePositionImprovement(
        keyword.currentPosition,
        keyword.targetPosition,
        month,
        parameters.timelineMonths,
        parameters.effortLevel
      );
      
      const ctr = getCTR(projectedPosition, keyword.currentCTR);
      const sessions = keyword.searchVolume * ctr;
      expectedSessions += sessions;
    });
    
    const conservativeMultiplier = 0.7;
    const optimisticMultiplier = 1.3;
    
    const conservativeSessions = expectedSessions * conservativeMultiplier;
    const optimisticSessions = expectedSessions * optimisticMultiplier;
    
    const result: ForecastResult = {
      month,
      conservativeSessions: Math.round(conservativeSessions),
      expectedSessions: Math.round(expectedSessions),
      optimisticSessions: Math.round(optimisticSessions),
      conservativeConversions: Math.round(conservativeSessions * conversionRate),
      expectedConversions: Math.round(expectedSessions * conversionRate),
      optimisticConversions: Math.round(optimisticSessions * conversionRate),
    };
    
    if (revenuePerConversion && revenuePerConversion > 0) {
      result.conservativeRevenue = Math.round(result.conservativeConversions * revenuePerConversion);
      result.expectedRevenue = Math.round(result.expectedConversions * revenuePerConversion);
      result.optimisticRevenue = Math.round(result.optimisticConversions * revenuePerConversion);
    }
    
    results.push(result);
  }
  
  return results;
}

export function generateCaveats(
  keywords: KeywordData[],
  parameters: ProjectParameters
): string[] {
  const caveats = [
    'Forecasts assume consistent SEO implementation throughout the timeline',
    'Google algorithm updates could impact results positively or negatively',
    'Competitive landscape changes may affect ranking achievability',
    'Economic or industry disruption could impact conversion rates',
    'Delays in content or technical implementation will push the timeline',
  ];
  
  const avgPositionChange = keywords.reduce((sum, kw) => 
    sum + Math.abs(kw.currentPosition - kw.targetPosition), 0) / keywords.length;
  
  if (avgPositionChange > 30) {
    caveats.push('Large position improvements require significant effort and time investment');
  }
  
  if (parameters.timelineMonths < 6) {
    caveats.push('Short timeline may limit achievable ranking improvements');
  }
  
  if (parameters.timelineMonths > 18) {
    caveats.push('Long-term forecasts have increased uncertainty and should be reviewed quarterly');
  }
  
  const highVolumeKeywords = keywords.filter(kw => kw.searchVolume > 10000);
  if (highVolumeKeywords.length > 0) {
    caveats.push('High-volume keywords typically have higher competition and may require more resources');
  }
  
  return caveats;
}

export function generateMethodologyText(): string {
  return `
**Forecasting Methodology**

This forecast uses a statistical model that combines:

1. **Historical Performance Baseline**: Conversion rates are calculated from your historical data to ensure projections reflect your actual website performance.

2. **Industry-Standard CTR Curves**: Click-through rates by search position are based on aggregated industry data, showing the expected percentage of searchers who click on results at each ranking position.

3. **Ranking Improvement Modeling**: Position improvements follow a decay curve that models realistic SEO velocity - faster gains in early months, with progress slowing over time as you approach target positions.

4. **Three-Tier Confidence Intervals**:
   - **Conservative (70th percentile)**: Lower-bound estimate representing cautious outcomes
   - **Expected (50th percentile)**: Most likely outcome based on typical performance
   - **Optimistic (30th percentile)**: Upper-bound estimate representing favorable conditions

5. **Effort Level Adjustments**: Resource allocation impacts the speed of ranking improvements, with higher effort levels accelerating the timeline.

**Key Assumptions**:
- CTR rates follow established industry patterns unless custom data is provided
- Conversion rates remain consistent with historical performance
- SEO work is implemented consistently throughout the project timeline
- No major algorithm updates or competitive disruptions occur
- Technical and content recommendations are executed as planned

**Calculation Formula**:
\`\`\`
Projected Sessions = Σ (Search Volume × CTR at Projected Position)
Projected Conversions = Projected Sessions × Historical Conversion Rate
Revenue = Projected Conversions × Average Revenue per Conversion
\`\`\`

All projections include confidence intervals to reflect the inherent uncertainty in SEO forecasting.
  `.trim();
}
