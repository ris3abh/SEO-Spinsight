# SEO Forecasting Tool - User Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Quick Start](#quick-start)
3. [Data Preparation](#data-preparation)
4. [Using the Tool](#using-the-tool)
5. [Understanding Your Forecast](#understanding-your-forecast)
6. [Export Options](#export-options)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

## Introduction

The SEO Forecasting Tool helps you generate reliable, data-driven projections for your organic search initiatives. It uses statistical modeling, industry-standard CTR curves, and your historical data to create three-tier forecasts (Conservative, Expected, and Optimistic scenarios).

### Key Features
- **No Data Fabrication**: Only uses data you provide
- **Three-Tier Forecasting**: Get conservative, expected, and optimistic projections
- **Flexible Input**: Accepts CSV or Excel files
- **Comprehensive Output**: Exports include methodology and risk factors
- **Validation**: Automatic data validation with helpful error messages

## Quick Start

### 1. Access the Tool
Open the tool in your web browser (typically at `http://localhost:3000` for local development).

### 2. Prepare Your Data
You'll need at minimum:
- **Keyword data** with current positions, target positions, and search volumes

Optionally:
- **Historical traffic data** for accurate conversion rate calculations
- **Revenue per conversion** for revenue projections

### 3. Generate Your Forecast
1. Upload your keyword data file
2. Set your timeline and effort level
3. Click "Generate Forecast"
4. Review results and export

## Data Preparation

### Required: Keyword Data

Create a CSV or Excel file with these columns:

| Column | Required | Format | Description | Example |
|--------|----------|--------|-------------|---------|
| `keyword` | Yes | Text | The keyword or search term | "seo tools" |
| `currentPosition` | Yes | Number (1-100) | Current Google ranking | 15 |
| `targetPosition` | Yes | Number (1-100) | Desired ranking | 5 |
| `searchVolume` | Yes | Number | Monthly search volume | 2400 |
| `currentCTR` | No | Decimal (0-1) | Current click rate | 0.032 |

**Column Name Variations Accepted:**
- `keyword` / `Keyword` / `KEYWORD`
- `currentPosition` / `Current Position` / `current_position`
- `targetPosition` / `Target Position` / `target_position`
- `searchVolume` / `Search Volume` / `search_volume`
- `currentCTR` / `Current CTR` / `current_ctr`

**Sample Keywords CSV:**
```csv
keyword,currentPosition,targetPosition,searchVolume
seo forecasting tool,15,3,2400
organic traffic growth,25,5,1800
keyword ranking improvement,45,10,950
```

### Optional: Historical Traffic Data

Create a CSV or Excel file with these columns:

| Column | Required | Format | Description | Example |
|--------|----------|--------|-------------|---------|
| `date` | Yes | Text | Date identifier | "2024-01" |
| `sessions` | Yes | Number | Total sessions | 15000 |
| `conversions` | Yes | Number | Total conversions | 300 |

**Column Name Variations Accepted:**
- `date` / `Date` / `DATE`
- `sessions` / `Sessions` / `SESSIONS`
- `conversions` / `Conversions` / `CONVERSIONS`

**Sample Historical CSV:**
```csv
date,sessions,conversions
2024-01,15000,300
2024-02,16200,340
2024-03,14800,285
```

**Note:** If you don't provide historical data, the tool will use a default 2% conversion rate.

### Sample Files

Sample data files are included in the `public/` directory:
- `sample-keywords.csv` - Example keyword data
- `sample-historical.csv` - Example historical traffic data

Download these as templates for your own data.

## Using the Tool

### Step 1: Upload Keyword Data

1. Click the "Keyword Data" file upload button
2. Select your CSV or Excel file
3. Wait for the file to parse
4. Look for the confirmation message: "✓ Loaded X keywords"

**Troubleshooting Upload Issues:**
- Ensure file is .csv, .xlsx, or .xls format
- Check that all required columns are present
- Verify data types match requirements (numbers for positions, etc.)
- Review any parse warnings that appear

### Step 2: Upload Historical Data (Optional)

1. Click the "Historical Traffic Data" file upload button
2. Select your CSV or Excel file
3. Wait for the file to parse
4. Look for the confirmation message: "✓ Loaded X historical data points"

**If you skip this step:** The tool will use a default 2% conversion rate for projections.

### Step 3: Configure Parameters

#### Timeline (Months)
- **Range:** 1-36 months
- **Recommendation:** 6-18 months for most accurate forecasts
- **Note:** Longer timelines increase uncertainty

#### Effort Level
Choose based on your resource allocation:

| Level | Multiplier | When to Use |
|-------|-----------|-------------|
| **Low** | 0.6x | Limited resources, maintenance mode |
| **Medium** | 1.0x | Standard SEO program |
| **High** | 1.4x | Aggressive campaign, dedicated team |

#### Revenue per Conversion (Optional)
- Enter average revenue per conversion for revenue projections
- Leave blank if you only need sessions/conversions
- Use consistent units (e.g., all in USD)

### Step 4: Generate Forecast

1. Click the "Generate Forecast" button
2. Wait for processing (typically <5 seconds)
3. Review validation errors if any appear
4. View your forecast results below

**Common Validation Errors:**
- "No keyword data provided" - Upload a keyword file first
- "Invalid current position" - Positions must be 1-100
- "Invalid search volume" - Volume must be a positive number

## Understanding Your Forecast

### Summary Cards

At the top of your results, you'll see three summary cards:

1. **Total Sessions (Expected)** - Total projected organic sessions
2. **Total Conversions (Expected)** - Total projected conversions
3. **Total Revenue (Expected)** - Total projected revenue (if you provided revenue/conversion)

These numbers represent the sum across all months in your timeline for the "Expected" scenario.

### Monthly Breakdown Table

The detailed table shows month-by-month projections for:

**Sessions:**
- Conservative Sessions (70% of expected)
- Expected Sessions (baseline forecast)
- Optimistic Sessions (130% of expected)

**Conversions:**
- Conservative Conversions
- Expected Conversions
- Optimistic Conversions

**Revenue (if provided):**
- Conservative Revenue
- Expected Revenue
- Optimistic Revenue

### How Rankings Improve Over Time

The tool models ranking improvements using a decay curve:

- **Months 1-3:** Faster initial progress (easier to move from position 50 → 40 than 15 → 10)
- **Mid-Timeline:** Steady progress toward targets
- **Final Months:** Slower improvements as you approach targets

**Effort Level Impact:**
- Low effort: Takes longer to reach targets
- Medium effort: Standard progression
- High effort: Accelerated timeline

### Forecasting Methodology

The tool uses this calculation for each keyword, each month:

```
1. Calculate projected position improvement for the month
2. Look up CTR for that position (industry standard or custom)
3. Calculate: Search Volume × CTR = Projected Sessions
4. Apply conversion rate: Sessions × Conversion Rate = Conversions
5. If revenue provided: Conversions × Revenue/Conversion = Revenue
6. Sum across all keywords for monthly total
7. Apply confidence intervals (70% / 100% / 130%) for three scenarios
```

### Caveats & Risk Factors

Every forecast includes automatic caveats. Pay attention to these:

**Standard Caveats:**
- Assumes consistent SEO implementation
- Algorithm updates may impact results
- Competitive changes may affect achievability
- Economic disruptions could impact conversion rates
- Implementation delays will push timeline

**Contextual Caveats** (based on your data):
- Large position improvements require significant effort
- Short timelines may limit achievability
- Long timelines have increased uncertainty
- High-volume keywords face more competition

## Export Options

### CSV Export

**Best for:**
- Further analysis in Excel/Google Sheets
- Importing into other tools
- Creating custom charts

**Includes:**
- Monthly breakdown table
- All three scenarios
- Revenue columns (if applicable)

**To export:** Click "Export CSV" button

### Excel Export

**Best for:**
- Client presentations
- Comprehensive documentation
- Sharing with stakeholders

**Includes:**
- **Forecast Tab:** Monthly breakdown table with formatting
- **Summary Tab:**
  - Total projections
  - Full methodology explanation
  - All assumptions listed
  - Risk factors and caveats

**To export:** Click "Export Excel" button

## Best Practices

### Data Quality

✅ **Do:**
- Use accurate current ranking data (check within last 30 days)
- Include at least 3-6 months of historical data
- Verify search volumes are current
- Double-check target positions are realistic

❌ **Don't:**
- Use outdated ranking data
- Set unrealistic target positions (e.g., position 50 → 1 in 3 months)
- Mix different geographic markets in one forecast
- Include branded keywords with generic keywords

### Timeline Selection

| Project Type | Recommended Timeline | Notes |
|--------------|---------------------|-------|
| Quick wins | 3-6 months | Focus on low-hanging fruit |
| Standard campaign | 6-12 months | Balanced mix of keywords |
| Aggressive push | 12-18 months | Major ranking improvements |
| Strategic planning | 18-24 months | Long-term visibility goals |

**Avoid:** Timelines over 24 months - too much uncertainty

### Effort Level Selection

Consider these factors:

**Low Effort:**
- Small team (1-2 people)
- Limited content budget
- Maintenance mode

**Medium Effort:**
- Dedicated SEO team
- Regular content production
- Active link building

**High Effort:**
- Large dedicated team
- Significant content budget
- Aggressive link building
- Technical SEO overhaul

### Scenario Planning

Use the three scenarios strategically:

- **Conservative:** Budget planning, minimum expectations
- **Expected:** Primary forecast for planning
- **Optimistic:** Best-case for leadership presentations

**Pro Tip:** Plan resources around the conservative scenario, but track against expected.

## Troubleshooting

### File Upload Issues

**Problem:** File won't upload
- **Solution:** Ensure file is .csv, .xlsx, or .xls format
- Check file isn't corrupted
- Try re-saving from Excel/Google Sheets

**Problem:** Parse errors appear
- **Solution:** Check column names match requirements
- Ensure no special characters in data
- Remove any merged cells in Excel files

**Problem:** Some rows are skipped
- **Solution:** Review parse warnings
- Check for blank required fields
- Verify data types (numbers in number fields)

### Validation Errors

**"Invalid current position"**
- Must be between 1-100
- Cannot be 0 or negative
- Cannot be blank

**"Invalid target position"**
- Must be between 1-100
- Should be lower (better) than current position
- Cannot be blank

**"Invalid search volume"**
- Must be a positive number
- Cannot be negative or blank
- Use whole numbers (not decimals)

### Unexpected Results

**Sessions seem too high/low:**
- Check your search volumes are accurate
- Verify target positions are realistic
- Review CTR values (if custom provided)

**Conversions seem off:**
- Check your historical conversion rate
- Ensure historical data is organic traffic only
- Consider if conversion rate will change

**Rankings improve too fast/slow:**
- Adjust effort level
- Extend/shorten timeline
- Review if target positions are realistic

### Browser Issues

**Tool won't load:**
- Try refreshing the page
- Clear browser cache
- Try a different browser (Chrome, Firefox, Safari)

**Export buttons don't work:**
- Check browser allows downloads
- Disable popup blockers for this site
- Try downloading one file at a time

## Getting Help

For additional support:

1. Review the README.md file for technical details
2. Check sample data files in public/ folder
3. Contact your development team for technical issues
4. Consult SEO team lead for methodology questions

## Appendix: CTR Curve Reference

Industry-standard CTR by position (used when custom CTR not provided):

| Position | CTR | Position | CTR |
|----------|-----|----------|-----|
| 1 | 31.6% | 11 | 2.6% |
| 2 | 15.8% | 12 | 2.3% |
| 3 | 10.5% | 13 | 2.1% |
| 4 | 7.7% | 14 | 1.9% |
| 5 | 6.2% | 15 | 1.7% |
| 6 | 5.1% | 16 | 1.6% |
| 7 | 4.3% | 17 | 1.5% |
| 8 | 3.8% | 18 | 1.4% |
| 9 | 3.3% | 19 | 1.3% |
| 10 | 2.9% | 20 | 1.2% |

Positions 21-50: Exponential decay from 1.2%  
Positions 51-100: Further decay from ~0.5%

These are based on aggregated industry data and represent average CTRs across various industries and query types.

---

**Last Updated:** January 2025  
**Version:** 1.0
