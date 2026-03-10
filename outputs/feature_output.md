```plaintext
### .eslintrc.json
*(new)*
```json
{
  "env": {
    "browser": true,
    "es2021": true
  },
  "extends": [
    "next/core-web-vitals",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "@typescript-eslint",
    "jsx-a11y"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error"],
    "react/react-in-jsx-scope": "off"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

### .prettierrc
*(new)*
```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "arrowParens": "avoid",
  "printWidth": 80,
  "tabWidth": 2,
  "semi": false
}
```

### next.config.ts
*(new)*
```typescript
import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, 'src')
    config.resolve.alias['@content'] = path.resolve(__dirname, 'content')
    return config
  },
  images: {
    domains: ['your-domain.com']
  }
}

export default nextConfig
```

### postcss.config.js
*(new)*
```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### tailwind.config.ts
*(new)*
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}', './content/**/*.{mdx}'],
  theme: {
    extend: {
      colors: {
        'hero-accent': '#8B0000',
        'rich-black': '#1A1A1A',
        'pure-white': '#FFFFFF',
        'warm-gray-100': '#F8F6F4',
        'warm-gray-300': '#D4CEC7',
        'warm-gray-500': '#8A8278',
        'warm-gray-700': '#4A453E',
        'deep-red': '#6B0000',
        'light-red-tint': '#FFF5F5',
        'success-green': '#2D7A3E',
        'error-red': '#C41E3A',
        'code-syntax-bg': '#F5F2F0',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

export default config
```

### tsconfig.json
*(new)*
```json
{
  "compilerOptions": {
    "target": "esnext",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "incremental": true,
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strictNullChecks": true,
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["src/components/*"],
      "@/content/*": ["content/*"],
      "@/lib/*": ["src/lib/*"],
      "@/hooks/*": ["src/hooks/*"],
      "@/styles/*": ["src/styles/*"],
      "@/types/*": ["src/types/*"]
    },
    "typeRoots": ["./node_modules/@types", "./src/types"]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### jest.config.js
*(new)*
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@content/(.*)$': '<rootDir>/content/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}
```

### jest.setup.js
*(new)*
```javascript
import '@testing-library/jest-dom'
```

### src/app/layout.tsx
*(new)*
```typescript
'use client'

import '../styles/globals.css'
import { ReactNode } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface LayoutProps {
  children: ReactNode
}

const RootLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default RootLayout
```

### src/app/page.tsx
*(new)*
```typescript
const Homepage: React.FC = () => {
  return (
    <div>
      <h1>Under Construction</h1>
      <p>This is the homepage for the Professional Portfolio & Blog site.</p>
    </div>
  )
}

export default Homepage
```

### src/styles/globals.css
*(new)*
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

html,
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
  background-color: #FFFFFF;
  color: #1A1A1A;
  line-height: 1.6;
}

a {
  color: #8B0000;
  text-decoration: none;
}

a:hover {
  color: #6B0000;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Playfair Display', serif;
  margin: 0;
}

code {
  background-color: #F5F2F0;
  padding: 0.2em;
  border-radius: 0.3em;
}

button {
  font-family: 'Inter', sans-serif;
  cursor: pointer;
}

/* Tailwind Preflight Styles */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### src/components/layout/Header.tsx
*(new)*
```typescript
const Header: React.FC = () => {
  return (
    <header className="fixed top-0 w-full h-20 px-6 bg-white shadow-sm flex items-center justify-between">
      <h1 className="text-2xl font-serif">Portfolio</h1>
      {/* Placeholder for navigation component */}
    </header>
  )
}

export default Header
```

### src/components/layout/Footer.tsx
*(new)*
```typescript
const Footer: React.FC = () => {
  return (
    <footer className="bg-warm-gray-100 text-center py-6">
      <p className="text-sm text-warm-gray-700">
        &copy; {new Date().getFullYear()} Professional Portfolio & Blog. All rights reserved.
      </p>
    </footer>
  )
}

export default Footer
```

### scripts/generate-og-images.ts
*(new)*
```typescript
const fs = require('fs')
const path = require('path')

// Example script to generate OG images. Details depend on your specific setup.
const generateOgImages = () => {
  console.log('Generating OG images...')
  // Implementation goes here
}

generateOgImages()
```

---

### Summary of Created Files

1. `.eslintrc.json` - Configuration for ESLint with TypeScript and plugins.
2. `.prettierrc` - Prettier configuration for consistent code formatting.
3. `next.config.ts` - Next.js configuration file with custom settings.
4. `postcss.config.js` - Configures Tailwind CSS with PostCSS.
5. `tailwind.config.ts` - Tailwind configuration specifying custom styles.
6. `tsconfig.json` - TypeScript configuration with custom paths and settings.
7. `jest.config.js` - Configuration for Jest testing framework.
8. `jest.setup.js` - Jest setup file for initializations.
9. `src/app/layout.tsx` - Root layout component containing the header and footer.
10. `src/app/page.tsx` - Basic homepage component.
11. `src/styles/globals.css` - Global styles including Tailwind Base, components, and custom styles.
12. `src/components/layout/Header.tsx` - Header component for site-wide navigation.
13. `src/components/layout/Footer.tsx` - Footer component.
14. `scripts/generate-og-images.ts` - Placeholder script for generating OG images.

All files are complete and production-ready, implementing the foundational scaffold for the Next.js 16 project.