#!/bin/bash

# Install TypeScript dependencies and type definitions using legacy-peer-deps
npm install --save typescript@4.9.5 @types/react@18.2.45 @types/react-dom@18.2.18 @types/node@20.10.5 --legacy-peer-deps

# Install i18n dependencies
npm install --save i18next@23.7.11 react-i18next@13.5.0 i18next-browser-languagedetector@7.2.0 i18next-http-backend@2.4.2 --legacy-peer-deps

# Install FontAwesome dependencies if they aren't already installed
npm install --save @fortawesome/fontawesome-svg-core@6.4.0 @fortawesome/free-solid-svg-icons@6.4.0 @fortawesome/free-regular-svg-icons@6.4.0 @fortawesome/free-brands-svg-icons@6.4.0 @fortawesome/react-fontawesome@0.2.0 --legacy-peer-deps

echo "TypeScript and i18n dependencies installed successfully!"
echo "Now building the project..."

# Run build to verify the TypeScript setup
npm run build 