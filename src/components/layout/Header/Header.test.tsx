import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Header from './Header'

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockedImage({ src, alt, width, height, ...props }: any) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        data-testid="header-logo"
        {...props}
      />
    )
  }
})

describe('Header Component', () => {
  beforeEach(() => {
    render(<Header />)
  })

  describe('Rendering', () => {
    it('renders without crashing', () => {
      expect(screen.getByRole('banner')).toBeInTheDocument()
    })

    it('has correct header structure with proper styling classes', () => {
      const header = screen.getByRole('banner')
      expect(header).toHaveClass('bg-white', 'border-b', 'h-[125px]', 'flex', 'items-center')
    })
  })

  describe('Logo', () => {
    it('displays the Wynn Resorts logo', () => {
      const logo = screen.getByTestId('header-logo')
      expect(logo).toBeInTheDocument()
      expect(logo).toHaveAttribute('src', '/wynn-logo.svg')
      expect(logo).toHaveAttribute('alt', 'Wynn Resorts')
    })

    it('has correct logo dimensions', () => {
      const logo = screen.getByTestId('header-logo')
      expect(logo).toHaveAttribute('width', '161')
      expect(logo).toHaveAttribute('height', '77')
    })
  })

  describe('Navigation', () => {
    const navigationItems = [
      'ROOMS & SUITES',
      'WYNN REWARDS', 
      'OFFERS',
      'DINING',
      'ENTERTAINMENT',
      'MEETINGS & EVENTS'
    ]

    it('renders all navigation links', () => {
      navigationItems.forEach(item => {
        expect(screen.getByText(item)).toBeInTheDocument()
      })
    })

    it('has correct navigation aria-label', () => {
      const nav = screen.getByLabelText('Main navigation')
      expect(nav).toBeInTheDocument()
    })

    it('applies correct styling to navigation links', () => {
      navigationItems.forEach(item => {
        const link = screen.getByText(item)
        expect(link).toHaveClass('font-medium', 'text-foreground', 'hover:text-gray-900', 'tracking-wide')
      })
    })

    it('navigation is hidden on mobile (md:flex class)', () => {
      const nav = screen.getByLabelText('Main navigation')
      expect(nav).toHaveClass('hidden', 'md:flex')
    })

    it('navigation links are clickable', () => {
      navigationItems.forEach(item => {
        const link = screen.getByText(item)
        expect(link).toHaveAttribute('href', '#')
      })
    })
  })

  describe('Language Selector', () => {
    it('renders language selector', () => {
      const languageSelector = screen.getByRole('combobox')
      expect(languageSelector).toBeInTheDocument()
    })

    it('has EN as default value', () => {
      const languageSelector = screen.getByRole('combobox')
      expect(languageSelector).toHaveAttribute('data-state', 'closed')
    })

    it('displays EN in the selector', () => {
      const enText = screen.getByText('EN')
      expect(enText).toBeInTheDocument()
    })

    it('has correct styling classes for language selector', () => {
      const trigger = screen.getByRole('combobox')
      expect(trigger).toHaveClass('w-20', 'border-none', 'shadow-none', 'text-[17px]')
    })
  })

  describe('Accessibility', () => {
    it('has proper semantic header element', () => {
      const header = screen.getByRole('banner')
      expect(header).toBeInTheDocument()
    })

    it('navigation has proper aria-label', () => {
      const nav = screen.getByLabelText('Main navigation')
      expect(nav).toBeInTheDocument()
    })

    it('language selector has proper role', () => {
      const selector = screen.getByRole('combobox')
      expect(selector).toBeInTheDocument()
    })

    it('logo has descriptive alt text', () => {
      const logo = screen.getByAltText('Wynn Resorts')
      expect(logo).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('applies correct responsive padding classes', () => {
      const container = screen.getByRole('banner').querySelector('div')
      expect(container).toHaveClass('px-4', 'sm:px-6', 'lg:px-[60px]')
    })

    it('navigation is responsive with hidden/flex classes', () => {
      const nav = screen.getByLabelText('Main navigation')
      expect(nav).toHaveClass('hidden', 'md:flex')
    })

    it('has proper flex layout structure', () => {
      const innerContainer = screen.getByRole('banner').querySelector('.flex.items-center.justify-between')
      expect(innerContainer).toBeInTheDocument()
      expect(innerContainer).toHaveClass('h-16')
    })
  })

  describe('Layout Structure', () => {
    it('has correct container max-width and centering', () => {
      const container = screen.getByRole('banner').querySelector('div')
      expect(container).toHaveClass('mx-auto', 'w-full')
    })

    it('logo container has flex-shrink-0 class', () => {
      const logoContainer = screen.getByTestId('header-logo').parentElement
      expect(logoContainer).toHaveClass('flex-shrink-0')
    })

    it('language selector container has correct flex classes', () => {
      const selectorContainer = screen.getByRole('combobox').closest('.flex.items-center')
      expect(selectorContainer).toHaveClass('flex', 'items-center')
    })
  })
})

describe('Header Component Integration', () => {
  it('maintains layout integrity with all elements present', () => {
    render(<Header />)
    
    // Check that all major sections are present
    expect(screen.getByTestId('header-logo')).toBeInTheDocument()
    expect(screen.getByLabelText('Main navigation')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    
    // Check that they're all within the header
    const header = screen.getByRole('banner')
    expect(header).toContainElement(screen.getByTestId('header-logo'))
    expect(header).toContainElement(screen.getByLabelText('Main navigation'))
    expect(header).toContainElement(screen.getByRole('combobox'))
  })
})
