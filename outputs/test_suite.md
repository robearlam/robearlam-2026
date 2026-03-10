# Comprehensive Jest Test Suite for Personal Portfolio & Blog Website

## Test Plan

### Overview
This test suite validates all acceptance criteria and functional requirements from the Product Requirements Specification using Test-Driven Development principles. Tests are written BEFORE implementation to define correct behaviour and serve as executable documentation.

### Testing Strategy

| Test Category | Purpose | Tools | Coverage |
|---------------|---------|-------|----------|
| **Unit Tests** | Validate individual component behaviour, props handling, rendering logic | Jest + React Testing Library | All components in isolation |
| **Integration Tests** | Validate page-level behaviour, component composition, user journeys | Jest + RTL + MSW | All pages, multi-step interactions |
| **Routing Tests** | Validate date-based URL patterns, dynamic routes, 404 handling | Jest + Next.js test utilities | Blog/speaking URL patterns |
| **Content Tests** | Validate MDX parsing, frontmatter extraction, content rendering | Jest + MDX utilities | Content fetching functions |
| **Accessibility Tests** | Validate WCAG 2.1 AA compliance, keyboard navigation, ARIA | jest-axe + RTL | All interactive components |
| **Form Tests** | Validate input validation, submission, error handling, spam protection | Jest + RTL | Contact form |
| **SEO Tests** | Validate metadata, structured data, social tags | Jest | All pages with metadata |

### Test Organisation
```
__tests__/
├── setup/
│   └── test-utils.tsx          # Custom render with providers
├── components/
│   ├── layout/
│   ├── ui/
│   ├── home/
│   ├── about/
│   ├── blog/
│   ├── speaking/
│   ├── contact/
│   ├── seo/
│   └── mdx/
├── pages/
│   ├── home.test.tsx
│   ├── about.test.tsx
│   ├── blog-index.test.tsx
│   ├── blog-article.test.tsx
│   ├── speaking.test.tsx
│   ├── contact.test.tsx
│   └── 404.test.tsx
├── lib/
│   ├── content/
│   ├── utils/
│   └── validators/
├── integration/
│   ├── navigation.test.tsx
│   ├── blog-journey.test.tsx
│   └── contact-submission.test.tsx
└── accessibility/
    └── wcag-compliance.test.tsx
```

---

## Setup Instructions

### Required Packages

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",
    "@testing-library/react-hooks": "^8.0.1",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "jest-axe": "^8.0.0",
    "@types/jest": "^29.5.11",
    "msw": "^2.0.11",
    "@axe-core/react": "^4.8.2",
    "next-router-mock": "^0.9.10"
  }
}
```

### jest.config.js

```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/types/(.*)$': '<rootDir>/src/types/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
  ],
  testMatch: [
    '**/__tests__/**/*.(test|spec).[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

### jest.setup.js

```javascript
import '@testing-library/jest-dom'
import 'jest-axe/extend-expect'

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return []
  }
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))
```

### __tests__/setup/test-utils.tsx

```typescript
import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

// Add any providers here (theme, etc.)
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Helper to mock blog posts
export const mockBlogPost = {
  slug: 'test-article',
  year: '2024',
  month: '01',
  title: 'Test Article',
  date: '2024-01-15',
  excerpt: 'This is a test article excerpt for testing purposes.',
  category: 'Technology',
  tags: ['testing', 'jest'],
  readingTime: 5,
  content: '<p>This is the article content.</p>',
}

// Helper to mock speaking events
export const mockSpeakingEvent = {
  slug: 'test-conference',
  year: '2024',
  month: '06',
  title: 'Test Conference Talk',
  date: '2024-06-15',
  event: 'Tech Conference 2024',
  location: 'San Francisco, CA',
  topic: 'Building Resilient Systems',
  isPast: false,
  description: 'A talk about building resilient distributed systems.',
}
```

---

## Complete Test Suite

### 1. Layout Component Tests

#### __tests__/components/layout/Header.test.tsx

```typescript
import { render, screen } from '@/__tests__/setup/test-utils'
import { axe } from 'jest-axe'
import Header from '@/components/layout/Header'

describe('Header Component', () => {
  describe('Rendering', () => {
    it('renders the site header with navigation', () => {
      render(<Header />)
      
      const header = screen.getByRole('banner')
      expect(header).toBeInTheDocument()
    })

    it('renders the site name or logo', () => {
      render(<Header />)
      
      const siteName = screen.getByRole('link', { name: /home/i })
      expect(siteName).toBeInTheDocument()
    })

    it('renders all primary navigation links', () => {
      render(<Header />)
      
      expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /blog/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /speaking/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
    })

    it('applies transparent background when transparent prop is true', () => {
      const { container } = render(<Header transparent={true} />)
      
      const header = container.querySelector('header')
      expect(header).toHaveClass('bg-transparent')
    })

    it('applies solid background when transparent prop is false or undefined', () => {
      const { container } = render(<Header transparent={false} />)
      
      const header = container.querySelector('header')
      expect(header).not.toHaveClass('bg-transparent')
    })
  })

  describe('Responsive Behaviour', () => {
    it('shows desktop navigation on viewports >= 768px', () => {
      // Mock viewport width
      global.innerWidth = 1024
      render(<Header />)
      
      const nav = screen.getByRole('navigation')
      expect(nav).toBeVisible()
    })

    it('shows mobile menu button on viewports < 768px', () => {
      global.innerWidth = 375
      render(<Header />)
      
      const menuButton = screen.getByRole('button', { name: /menu/i })
      expect(menuButton).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Header />)
      const results = await axe(container)
      
      expect(results).toHaveNoViolations()
    })

    it('includes skip navigation link', () => {
      render(<Header />)
      
      const skipLink = screen.getByRole('link', { name: /skip to main content/i })
      expect(skipLink).toBeInTheDocument()
    })

    it('has proper ARIA landmarks', () => {
      render(<Header />)
      
      expect(screen.getByRole('banner')).toBeInTheDocument()
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
  })

  describe('Visual Requirements (NFR)', () => {
    it('header height is 80px on desktop', () => {
      const { container } = render(<Header />)
      const header = container.querySelector('header')
      
      expect(header).toHaveClass('h-20') // Tailwind h-20 = 80px
    })

    it('header height is 64px on mobile', () => {
      global.innerWidth = 375
      const { container } = render(<Header />)
      const header = container.querySelector('header')
      
      expect(header).toHaveClass('md:h-20', 'h-16') // h-16 = 64px
    })
  })
})
```

#### __tests__/components/layout/Navigation.test.tsx

```typescript
import { render, screen } from '@/__tests__/setup/test-utils'
import { axe } from 'jest-axe'
import Navigation from '@/components/layout/Navigation'

describe('Navigation Component', () => {
  const defaultProps = {
    currentPath: '/blog',
    orientation: 'horizontal' as const,
  }

  describe('Rendering', () => {
    it('renders all navigation items', () => {
      render(<Navigation {...defaultProps} />)
      
      expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /blog/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /speaking/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument()
    })

    it('renders in horizontal orientation by default', () => {
      const { container } = render(<Navigation {...defaultProps} />)
      const nav = container.querySelector('nav')
      
      expect(nav).toHaveClass('flex-row')
    })

    it('renders in vertical orientation when specified', () => {
      const { container } = render(
        <Navigation currentPath="/about" orientation="vertical" />
      )
      const nav = container.querySelector('nav')
      
      expect(nav).toHaveClass('flex-col')
    })
  })

  describe('Active State Indicator', () => {
    it('marks the current page link as active', () => {
      render(<Navigation currentPath="/blog" orientation="horizontal" />)
      
      const blogLink = screen.getByRole('link', { name: /blog/i })
      expect(blogLink).toHaveAttribute('aria-current', 'page')
    })

    it('applies active styling to current page link', () => {
      render(<Navigation currentPath="/speaking" orientation="horizontal" />)
      
      const speakingLink = screen.getByRole('link', { name: /speaking/i })
      expect(speakingLink).toHaveClass('border-b-[3px]', 'border-dark-red')
    })

    it('does not mark other links as active', () => {
      render(<Navigation currentPath="/blog" orientation="horizontal" />)
      
      const aboutLink = screen.getByRole('link', { name: /about/i })
      expect(aboutLink).not.toHaveAttribute('aria-current', 'page')
    })

    it('handles nested paths correctly (e.g., /blog/2024/01/article)', () => {
      render(<Navigation currentPath="/blog/2024/01/test-article" orientation="horizontal" />)
      
      const blogLink = screen.getByRole('link', { name: /blog/i })
      expect(blogLink).toHaveAttribute('aria-current', 'page')
    })
  })

  describe('Hover and Focus States', () => {
    it('applies hover styles on mouse enter', async () => {
      const { user } = render(<Navigation {...defaultProps} />)
      
      const aboutLink = screen.getByRole('link', { name: /about/i })
      await user.hover(aboutLink)
      
      expect(aboutLink).toHaveClass('hover:text-dark-red')
    })

    it('shows focus indicator when navigating with keyboard', async () => {
      const { user } = render(<Navigation {...defaultProps} />)
      
      const aboutLink = screen.getByRole('link', { name: /about/i })
      await user.tab()
      
      expect(aboutLink).toHaveFocus()
      expect(aboutLink).toHaveClass('focus-visible:outline')
    })
  })

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<Navigation {...defaultProps} />)
      const results = await axe(container)
      
      expect(results).toHaveNoViolations()
    })

    