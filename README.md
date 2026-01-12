# SEO Forecasting Tool

An AI-powered SEO forecasting tool that generates reliable, tiered ROI projections for organic search initiatives based on user-provided data inputs.

## Features

- **Data Input System**: Upload CSV/Excel files or manually enter data for keywords and historical traffic
- **Statistical Forecasting Engine**: Generates three-tier forecasts (Conservative, Expected, Optimistic)
- **Industry-Standard CTR Curves**: Uses established click-through rate patterns by search position
- **Ranking Improvement Modeling**: Realistic SEO velocity curves based on effort level and timeline
- **Export Capabilities**: Download forecasts as CSV or Excel with methodology and caveats
- **Validation & Safety**: No data fabrication, transparent assumptions, bounds checking

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## How to Use

### 1. Prepare Your Data

#### Keyword Data (Required)

Create a CSV or Excel file with the following columns:

| Column Name | Type | Description | Required |
|------------|------|-------------|----------|
| keyword | String | The keyword or search term | Yes |
| currentPosition | Number (1-100) | Current ranking position | Yes |
| targetPosition | Number (1-100) | Target ranking position | Yes |
| searchVolume | Number | Monthly search volume | Yes |
| currentCTR | Number (0-1) | Current click-through rate | No |

**Example keyword data:**

```csv
keyword,currentPosition,targetPosition,searchVolume,currentCTR
seo forecasting tool,15,3,2400
organic traffic growth,25,5,1800
keyword ranking improvement,45,10,950
```

#### Historical Traffic Data (Optional)

Create a CSV or Excel file with the following columns:

| Column Name | Type | Description |
|------------|------|-------------|
| date | String | Date (any format) |
| sessions | Number | Number of sessions |
| conversions | Number | Number of conversions |

**Example historical data:**

```csv
date,sessions,conversions
2024-01,15000,300
2024-02,16200,340
2024-03,14800,285
```

*If no historical data is provided, the tool will use a default 2% conversion rate.*

### 2. Upload and Configure

1. **Upload Keyword Data**: Click the file upload button and select your keyword data file
2. **Upload Historical Data** (optional): Upload your historical traffic data
3. **Set Timeline**: Enter the number of months for the forecast (1-36 months)
4. **Select Effort Level**: Choose Low, Medium, or High based on resource allocation
5. **Add Revenue per Conversion** (optional): Enter the average revenue per conversion for revenue projections

### 3. Generate Forecast

Click the "Generate Forecast" button to create your projections. The tool will:

- Validate all input data
- Calculate baseline conversion rates from historical data
- Model ranking improvements over time using decay curves
- Generate three-tier forecasts with confidence intervals
- Display results in an interactive table

### 4. Review Results

The forecast includes:

- **Summary Cards**: Total expected sessions, conversions, and revenue (if provided)
- **Monthly Breakdown Table**: Detailed projections for each month across all three scenarios
- **Methodology**: Explanation of the forecasting approach and key assumptions
- **Caveats**: Risk factors and limitations specific to your data

### 5. Export

Download your forecast in two formats:

- **CSV**: Simple table format for further analysis
- **Excel**: Comprehensive workbook with forecast data, summary, methodology, and caveats

## Forecasting Methodology

### Three-Tier Confidence Intervals

- **Conservative (70th percentile)**: Lower-bound estimate (70% of expected)
- **Expected (50th percentile)**: Most likely outcome
- **Optimistic (30th percentile)**: Upper-bound estimate (130% of expected)

### CTR Curves

The tool uses industry-standard CTR data by position:

- Position 1: ~31.6%
- Position 2: ~15.8%
- Position 3: ~10.5%
- Position 4-10: 7.7% to 2.9%
- Position 11-20: 2.6% to 1.2%
- Position 21+: Exponential decay

You can override these with custom CTR data in your keyword file.

### Ranking Improvement Model

Position improvements follow a realistic decay curve:

- Faster progress in early months
- Slower progress as you approach target positions
- Adjusted by effort level (Low: 0.6x, Medium: 1.0x, High: 1.4x)
- Cannot improve beyond target position

### Calculation Formula

```
Projected Sessions = Σ (Search Volume × CTR at Projected Position)
Projected Conversions = Projected Sessions × Historical Conversion Rate
Revenue = Projected Conversions × Revenue per Conversion
```

## Safety Features

✅ **No Data Fabrication**: Only uses explicitly provided data  
✅ **Validation**: Comprehensive input validation with helpful error messages  
✅ **Bounds Checking**: CTR cannot exceed position 1 maximum (~35-40%)  
✅ **Realistic Curves**: Ranking improvements follow established velocity patterns  
✅ **Transparent Assumptions**: All assumptions clearly documented in output  
✅ **Confidence Intervals**: Three-tier forecasting reflects inherent uncertainty  

## Caveats & Limitations

All forecasts include automatic caveats such as:

- Forecasts assume consistent SEO implementation throughout timeline
- Google algorithm updates could impact results positively or negatively
- Competitive landscape changes may affect ranking achievability
- Economic or industry disruption could impact conversion rates
- Delays in content/technical implementation will push timeline

Additional contextual caveats are generated based on your specific data characteristics.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Data Processing**: PapaParse (CSV), SheetJS (Excel)
- **Charting**: Recharts (for future visualizations)

## Project Structure

```
/app
  /components
    FileUpload.tsx       # File upload component
    ForecastResults.tsx  # Results display component
  page.tsx              # Main application page
  layout.tsx            # Root layout
  globals.css           # Global styles

/lib
  forecasting.ts        # Core forecasting engine
  parser.ts             # CSV/Excel parsing utilities
  export.ts             # Export utilities (CSV/Excel)
```

## Development Roadmap

### Phase 1 ✅ (Current)
- Core forecasting engine with CSV/Excel input/output
- Web interface for data input
- Three-tier forecasting
- Export to CSV and Excel

### Phase 2 (Future)
- Interactive visualizations and charts
- Manual keyword entry interface
- Batch processing for multiple scenarios
- Historical forecast accuracy tracking

### Phase 3 (Future)
- API integrations (SEMrush, Ahrefs, Google Search Console)
- Automated data pulls
- Competitive analysis features
- Team collaboration features

### Phase 4 (Future)
- Machine learning models for improved accuracy
- Custom CTR curve training
- Industry-specific templates
- White-label reporting

## Contributing

This is an internal tool. For questions or feature requests, please contact the development team.

## License

Proprietary - Internal Use Only
