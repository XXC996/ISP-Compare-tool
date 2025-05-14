# React ISP Comparison Website

A React-based comparison website for ISPs and utilities, now with TypeScript and internationalization (i18n) support.

## Testing Branch

This is the testing branch where we can experiment with new features without affecting the main codebase.

Current experimental features:
- Multi-language support (English, Chinese, Hindi, Spanish)
- Support language filter
- Operation hours filter

## Recent Updates

### Data Structure and Component Updates
- Refactored `Comparison.tsx` to use `ispData.json` as the primary data source
- Updated type definitions with new `PlanData` interface
- Removed `networkTypes` and `messaging` options from filters
- Enhanced language support with actual supported languages
- Added price tier filtering with customizable ranges

### Price Data Management
- Added Python script (`update_prices.py`) for automated price updates from Excel files
- Created documentation in both English and Chinese for price update procedures
- Implemented safe update process with automatic backups
- Added support for preserving discount relationships when updating prices

### Internationalization Updates
- Added comprehensive translations for network types and speed tiers
- Updated language options to include: English, Chinese, Hindi, Punjabi, Arabic, Korean, Vietnamese, Tamil, and Malay
- Enhanced translation coverage for support channels and contract types

## Features

- TypeScript integration for improved type safety and development experience
- Internationalization (i18n) with support for multiple languages
- Responsive design with mobile-friendly UI
- Comparison tool for ISP plans and utilities
- FAQ section, newsletter signup, and more

## Installation

```bash
# Install dependencies
npm install

# OR use the setup script to install TypeScript dependencies
./setup-typescript.sh

# Start development server
npm start
```

## Fixing TypeScript Errors

If you encounter TypeScript errors after conversion, try these steps:

1. Run the setup script to install required dependencies:
   ```bash
   ./setup-typescript.sh
   ```

2. If JSX errors persist, make sure React types are properly installed:
   ```bash 
   npm install --save-dev @types/react @types/react-dom
   ```

3. For FontAwesome icon issues, uncomment the icon imports and make sure all FontAwesome packages are installed.

## i18n Support

The application supports multiple languages through i18n. Currently, English and Chinese are available.

### Adding a New Language

1. Create a new translation file in `/public/locales/<language-code>/translation.json`
2. Add the language option to the `LanguageSwitcher` component

## TypeScript

The project uses TypeScript for improved developer experience and type safety. Common types are defined in `src/types/index.ts`.

### Type Declarations

- We've added temporary type declarations in `src/types/declarations.d.ts` to resolve module import errors
- Use proper interfaces for props in components (see `src/components/PlanCard.tsx` as an example)

## Project Structure

```
react-isp-comparison/
├── public/
│   ├── locales/           # i18n translation files
│   │   ├── en/            # English translations
│   │   └── zh/            # Chinese translations
├── src/
│   ├── components/        # React components
│   ├── data/              # JSON data files
│   │   ├── ispData.json   # ISP provider and plan data
│   │   └── filterConfig.json # Configuration for filters
│   ├── styles/            # CSS files
│   ├── types/             # TypeScript type definitions
│   │   ├── index.ts       # Common interfaces
│   │   └── declarations.d.ts # Module declarations
│   ├── i18n.ts            # i18n configuration
│   ├── App.tsx            # Main App component
│   └── index.tsx          # Entry point
├── update_prices.py       # Python script for updating prices from Excel
├── UPDATE_PRICES_README.md   # Documentation for price updates (English)
├── UPDATE_PRICES_README_CN.md   # Documentation for price updates (Chinese)
└── package.json           # Dependencies and scripts
```

## Data Update Process

The application uses a structured JSON file for ISP data. To update prices:

1. Use the provided `update_prices.py` script to import prices from an Excel file
2. The script will automatically create a backup of the original data
3. Review the changes in the console output
4. Test the website to ensure all prices display correctly

See `UPDATE_PRICES_README.md` for detailed instructions. 