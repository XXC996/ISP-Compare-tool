# ISP Price Update Tool

This document explains how to update ISP prices in the React ISP Comparison website using the Excel data import tool.

## Overview

The `update_prices.py` script automates updating ISP prices from an Excel file to the website's JSON data. It handles:

- Reading the Excel file with ISP pricing data
- Parsing network types (NBN, Opticomm, RedTrain)
- Matching ISP providers across the Excel and JSON files
- Updating prices while maintaining discount relationships
- Creating backups of the original data
- Showing detailed change summaries

## Requirements

- Python 3.6+
- Required Python packages:
  - pandas
  - openpyxl

To install required packages:

```bash
pip install pandas openpyxl
```

## Excel File Format

The Excel file should follow this structure:

1. Network types (NBN, OPTICOMM, etc.) in the first column
2. Speed tiers in the header row of each network section
3. "Min Price ISP" and "Max Price ISP" rows listing providers
4. Price rows below each provider row
5. Optional dedicated "OCCOM Price" row with direct pricing

Example:

```
|          |           | 12/1M   | 25/5M  | 50/20M | ...  |
|----------|-----------|---------|--------|--------|------|
| NBN      |           |         |        |        |      |
|          | Min ISP   | TPG     | MATE   | KOGAN  | ...  |
|          | Min Price | 54.99   | 40     | 59.90  | ...  |
|          | Max ISP   | AUSSIE  | TELSTRA| TELSTRA| ...  |
|          | Max Price | 69      | 89     | 95     | ...  |
|          | OCCOM     | 58      | 65     | 75     | ...  |
```

## Usage

### Basic Usage

Run the script from the command line:

```bash
python update_prices.py
```

This will:
1. Use the default Excel file (`Price Comparison May 2025.xlsx`)
2. Update the default JSON file (`src/data/ispData.json`)
3. Create a backup of the original JSON file
4. Show detailed changes made

### Advanced Usage

Specify custom file paths:

```bash
python update_prices.py [excel_file_path] [json_file_path]
```

For example:

```bash
python update_prices.py "data/June 2025 Prices.xlsx" "src/data/custom-data.json"
```

## Workflow for Price Updates

1. Obtain the latest Excel file with updated pricing from stakeholders
2. Place the Excel file in the project root directory
3. Run the update script:
   ```bash
   python update_prices.py "Your New Price File.xlsx"
   ```
4. Review the changes in the console output
5. Test the website to ensure all prices display correctly
6. Commit the updated JSON file to your version control system

## Troubleshooting

If the script doesn't find or update some prices:

1. Check the Excel file format matches the expected structure
2. Verify that provider names in Excel match those in the JSON file
3. Ensure the Excel file has all required network types and speed tiers
4. Check the console output for warnings or errors

## Backup and Recovery

The script automatically creates a backup file with a timestamp. To restore from a backup:

```bash
cp src/data/ispData.json.[timestamp].bak src/data/ispData.json
```

## Adding New Providers or Speed Tiers

The script only updates existing providers and plans. To add new providers or speed tiers:

1. First manually add the new provider to the JSON file with default values
2. Then run the script to update with actual prices

## Further Development

This script may be enhanced with additional features:

- Add support for updating typicalEveningSpeed values
- Implement more robust error handling and validation
- Add a GUI for non-technical users to update prices 