# React ISP Comparison Website

A React-based comparison website for ISPs and utilities, now with TypeScript and internationalization (i18n) support.

## Testing Branch

This is the testing branch where we can experiment with new features without affecting the main codebase.

Current experimental features:
- Multi-language support (English, Chinese, Hindi, Spanish)
- Support language filter
- Operation hours filter

## Features

- TypeScript integration for improved type safety and development experience
- Internationalization (i18n) with support for English and Chinese languages
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
│   ├── styles/            # CSS files
│   ├── types/             # TypeScript type definitions
│   │   ├── index.ts       # Common interfaces
│   │   └── declarations.d.ts # Module declarations
│   ├── i18n.ts            # i18n configuration
│   ├── App.tsx            # Main App component
│   └── index.tsx          # Entry point
└── package.json           # Dependencies and scripts
``` 