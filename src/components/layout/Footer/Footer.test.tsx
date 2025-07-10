import { render, screen } from '@testing-library/react'
import Footer from './Footer'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, className, width, height, ...props }: any) => (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      width={width}
      height={height}
      {...props}
    />
  )
}))

describe('Footer', () => {
  describe('Rendering', () => {
    it('renders footer with correct background and text colors', () => {
      render(<Footer />)
      
      const footer = screen.getByRole('contentinfo')
      expect(footer).toHaveClass('bg-[#5A3A27]', 'text-white')
    })

    it('renders all main sections', () => {
      render(<Footer />)
      
      expect(screen.getByText('Shop Wynn Collection')).toBeInTheDocument()
      expect(screen.getByText('About Us')).toBeInTheDocument()
      expect(screen.getByText('Wynn Palace Cotai')).toBeInTheDocument()
      expect(screen.getByText('Wynn and Encore Las Vegas')).toBeInTheDocument()
    })

    it('applies custom className when provided', () => {
      render(<Footer className="custom-footer-class" />)
      
      const footer = screen.getByRole('contentinfo')
      expect(footer).toHaveClass('custom-footer-class')
    })

    it('has proper container structure', () => {
      render(<Footer />)
      
      const container = screen.getByRole('contentinfo').querySelector('.max-w-7xl')
      expect(container).toHaveClass('max-w-7xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'py-12')
    })

    it('uses 4-column grid layout', () => {
      render(<Footer />)
      
      const gridContainer = screen.getByRole('contentinfo').querySelector('.grid')
      expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4', 'gap-8')
    })
  })

  describe('Shop Wynn Collection Section', () => {
    it('renders all Shop Wynn Collection links', () => {
      render(<Footer />)
      
      const section = screen.getByText('Shop Wynn Collection').closest('div')
      
      expect(screen.getByText('Gift Cards')).toBeInTheDocument()
      expect(screen.getByText('Wynn Stores')).toBeInTheDocument()
      expect(screen.getByText('Wynn Store App')).toBeInTheDocument()
      expect(screen.getByText('Mobile App')).toBeInTheDocument()
      expect(screen.getByText('Responsible Gaming')).toBeInTheDocument()
    })

    it('has proper link styling and hover effects', () => {
      render(<Footer />)
      
      const giftCardsLink = screen.getByText('Gift Cards')
      expect(giftCardsLink).toHaveClass('hover:underline')
      expect(giftCardsLink.closest('a')).toHaveAttribute('href', '#')
    })
  })

  describe('About Us Section', () => {
    it('renders all About Us links', () => {
      render(<Footer />)
      
      expect(screen.getByText('Careers')).toBeInTheDocument()
      expect(screen.getByText('Investor Relations')).toBeInTheDocument()
      expect(screen.getByText('Privacy Notice')).toBeInTheDocument()
      expect(screen.getByText('Cookie Notice')).toBeInTheDocument()
      expect(screen.getByText('Terms of Use')).toBeInTheDocument()
      expect(screen.getByText('Hotel Information & Directory')).toBeInTheDocument()
    })

    it('has more links than other sections', () => {
      render(<Footer />)
      
      const aboutSection = screen.getByText('About Us').closest('div')
      const links = aboutSection?.querySelectorAll('a')
      expect(links).toHaveLength(6)
    })
  })

  describe('Wynn Palace Cotai Section', () => {
    it('renders Wynn Palace Cotai links', () => {
      render(<Footer />)
      
      expect(screen.getByText('Encore Boston Harbor')).toBeInTheDocument()
      expect(screen.getByText('Wynn Macau')).toBeInTheDocument()
    })

    it('has fewest links among sections', () => {
      render(<Footer />)
      
      const palaceSection = screen.getByText('Wynn Palace Cotai').closest('div')
      const links = palaceSection?.querySelectorAll('a')
      expect(links).toHaveLength(2)
    })
  })

  describe('Wynn and Encore Las Vegas Section', () => {
    it('renders contact information', () => {
      render(<Footer />)
      
      expect(screen.getByText('3131 Las Vegas Blvd. Las Vegas, NV 89109')).toBeInTheDocument()
      expect(screen.getByText('+1 (702) 770-7000')).toBeInTheDocument()
    })

    it('displays "CONNECT WITH US" label', () => {
      render(<Footer />)
      
      expect(screen.getByText('CONNECT WITH US')).toBeInTheDocument()
      expect(screen.getByText('CONNECT WITH US')).toHaveClass('text-xs', 'mb-2')
    })
  })

  describe('Social Media Icons', () => {
    it('renders all social media icons', () => {
      render(<Footer />)
      
      expect(screen.getByAltText('Facebook')).toBeInTheDocument()
      expect(screen.getByAltText('Androind')).toBeInTheDocument()
      expect(screen.getByAltText('Apple')).toBeInTheDocument()
      expect(screen.getByAltText('Instagram')).toBeInTheDocument()
      expect(screen.getByAltText('X')).toBeInTheDocument()
    })

    it('has proper icon sources', () => {
      render(<Footer />)
      
      expect(screen.getByAltText('Facebook')).toHaveAttribute('src', '/icon-fb.svg')
      expect(screen.getByAltText('Androind')).toHaveAttribute('src', '/icon-android.svg')
      expect(screen.getByAltText('Apple')).toHaveAttribute('src', '/icon-apple.svg')
      expect(screen.getByAltText('Instagram')).toHaveAttribute('src', '/icon-ig.svg')
      expect(screen.getByAltText('X')).toHaveAttribute('src', '/icon-x.svg')
    })

    it('has correct icon dimensions', () => {
      render(<Footer />)
      
      const icons = [
        screen.getByAltText('Facebook'),
        screen.getByAltText('Androind'),
        screen.getByAltText('Apple'),
        screen.getByAltText('Instagram'),
        screen.getByAltText('X')
      ]

      icons.forEach(icon => {
        expect(icon).toHaveAttribute('width', '27')
        expect(icon).toHaveAttribute('height', '27')
        expect(icon).toHaveClass('h-[27px]', 'w-[27px]')
      })
    })

    it('uses 33px gap spacing between icons', () => {
      render(<Footer />)
      
      const socialContainer = screen.getByRole('list', { name: 'Social media links' })
      expect(socialContainer).toHaveStyle('gap: 33px')
      expect(socialContainer).toHaveClass('flex')
    })

    it('has proper link structure for each icon', () => {
      render(<Footer />)
      
      const facebookLink = screen.getByLabelText('Facebook')
      expect(facebookLink).toHaveAttribute('href', '#')
      expect(facebookLink).toHaveClass('hover:opacity-70')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels for social media links', () => {
      render(<Footer />)
      
      expect(screen.getByLabelText('Facebook')).toBeInTheDocument()
      expect(screen.getByLabelText('Androind')).toBeInTheDocument()
      expect(screen.getByLabelText('Apple')).toBeInTheDocument()
      expect(screen.getByLabelText('Instagram')).toBeInTheDocument()
      expect(screen.getByLabelText('X social network logo')).toBeInTheDocument()
    })

    it('has role="list" for social media container', () => {
      render(<Footer />)
      
      const socialContainer = screen.getByRole('list', { name: 'Social media links' })
      expect(socialContainer).toHaveAttribute('aria-label', 'Social media links')
    })

    it('has proper focus styling for social links', () => {
      render(<Footer />)
      
      const facebookLink = screen.getByLabelText('Facebook')
      expect(facebookLink).toHaveClass(
        'focus:outline-none',
        'focus:ring-2', 
        'focus:ring-offset-2',
        'focus:ring-[#006F62]',
        'rounded'
      )
    })

    it('has tabIndex for keyboard navigation', () => {
      render(<Footer />)
      
      const socialLinks = [
        screen.getByLabelText('Facebook'),
        screen.getByLabelText('Androind'),
        screen.getByLabelText('Apple'),
        screen.getByLabelText('Instagram'),
        screen.getByLabelText('X social network logo')
      ]

      socialLinks.forEach(link => {
        expect(link).toHaveAttribute('tabIndex', '0')
      })
    })

    it('has semantic footer element', () => {
      render(<Footer />)
      
      const footer = screen.getByRole('contentinfo')
      expect(footer.tagName).toBe('FOOTER')
    })
  })

  describe('Footer Bottom Section', () => {
    it('renders copyright notice', () => {
      render(<Footer />)
      
      expect(screen.getByText('© 2024 Wynn Resorts Holdings, LLC. All rights reserved.')).toBeInTheDocument()
    })

    it('renders data privacy notice', () => {
      render(<Footer />)
      
      expect(screen.getByText('Do Not Sell Or Share My Data')).toBeInTheDocument()
    })

    it('has proper styling for bottom section', () => {
      render(<Footer />)
      
      const bottomSection = screen.getByText('© 2024 Wynn Resorts Holdings, LLC. All rights reserved.').closest('div')?.parentElement
      expect(bottomSection).toHaveClass('mt-8', 'pt-8', 'text-center')
    })

    it('has proper text styling for bottom content', () => {
      render(<Footer />)
      
      const copyrightText = screen.getByText('© 2024 Wynn Resorts Holdings, LLC. All rights reserved.')
      const parentDiv = copyrightText.closest('.text-sm')
      expect(parentDiv).toHaveClass('text-sm', 'space-y-1')
    })
  })

  describe('Typography and Styling', () => {
    it('has proper heading styles', () => {
      render(<Footer />)
      
      const headings = [
        screen.getByText('Shop Wynn Collection'),
        screen.getByText('About Us'),
        screen.getByText('Wynn Palace Cotai'),
        screen.getByText('Wynn and Encore Las Vegas')
      ]

      headings.forEach(heading => {
        expect(heading).toHaveClass('text-sm', 'font-medium', 'mb-4', 'tracking-wide')
      })
    })

    it('has proper list styling', () => {
      render(<Footer />)
      
      const shopSection = screen.getByText('Shop Wynn Collection').closest('div')
      const list = shopSection?.querySelector('ul')
      expect(list).toHaveClass('space-y-2', 'text-sm')
    })

    it('has proper styling for contact information', () => {
      render(<Footer />)
      
      const contactDiv = screen.getByText('3131 Las Vegas Blvd. Las Vegas, NV 89109').closest('div')
      expect(contactDiv).toHaveClass('text-sm', 'space-y-1')
    })
  })

  describe('Image Loading', () => {
    it('uses lazy loading for social media icons', () => {
      render(<Footer />)
      
      const icons = [
        screen.getByAltText('Facebook'),
        screen.getByAltText('Androind'),
        screen.getByAltText('Apple'),
        screen.getByAltText('Instagram'),
        screen.getByAltText('X')
      ]

      icons.forEach(icon => {
        expect(icon).toHaveAttribute('loading', 'lazy')
      })
    })
  })

  describe('Responsive Design', () => {
    it('has responsive grid classes', () => {
      render(<Footer />)
      
      const grid = screen.getByRole('contentinfo').querySelector('.grid')
      expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4')
    })

    it('has responsive padding classes', () => {
      render(<Footer />)
      
      const container = screen.getByRole('contentinfo').querySelector('.max-w-7xl')
      expect(container).toHaveClass('px-4', 'sm:px-6', 'lg:px-8')
    })
  })

  describe('Props Interface', () => {
    it('accepts and applies className prop', () => {
      render(<Footer className="test-class additional-class" />)
      
      const footer = screen.getByRole('contentinfo')
      expect(footer).toHaveClass('test-class', 'additional-class')
    })

    it('works without className prop', () => {
      render(<Footer />)
      
      const footer = screen.getByRole('contentinfo')
      expect(footer).toBeInTheDocument()
      // Should still have base classes
      expect(footer).toHaveClass('bg-[#5A3A27]', 'text-white')
    })
  })

  describe('Content Structure', () => {
    it('maintains proper section ordering', () => {
      render(<Footer />)
      
      const sections = screen.getAllByRole('heading', { level: 3 })
      const sectionTexts = sections.map(section => section.textContent)
      
      expect(sectionTexts).toEqual([
        'Shop Wynn Collection',
        'About Us', 
        'Wynn Palace Cotai',
        'Wynn and Encore Las Vegas'
      ])
    })

    it('has all required links in correct sections', () => {
      render(<Footer />)
      
      // Verify link distribution
      const shopSection = screen.getByText('Shop Wynn Collection').closest('div')
      const aboutSection = screen.getByText('About Us').closest('div')
      const palaceSection = screen.getByText('Wynn Palace Cotai').closest('div')
      
      expect(shopSection?.querySelectorAll('a')).toHaveLength(5)
      expect(aboutSection?.querySelectorAll('a')).toHaveLength(6)  
      expect(palaceSection?.querySelectorAll('a')).toHaveLength(2)
    })
  })
}) 