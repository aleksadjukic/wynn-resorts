import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { toast } from 'sonner'
import Newsletter from './Newsletter'

// Mock Sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock fetch
const mockFetch = jest.fn()
global.fetch = mockFetch

// Mock Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, className, disabled, ...props }: any) => (
    <button 
      className={className} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  ),
}))

describe('Newsletter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockClear()
    ;(toast.success as jest.Mock).mockClear()
    ;(toast.error as jest.Mock).mockClear()
  })

  describe('Rendering', () => {
    it('renders newsletter section with all elements', () => {
      render(<Newsletter />)
      
      expect(screen.getByRole('region', { name: /newsletter section/i })).toBeInTheDocument()
      expect(screen.getByText('Get News & Updates')).toBeInTheDocument()
      expect(screen.getByText(/get latest developments and exciting news/i)).toBeInTheDocument()
      expect(screen.getByRole('form', { name: /newsletter signup/i })).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: /your email address/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /join the newsletter/i })).toBeInTheDocument()
    })

    it('has proper semantic structure', () => {
      render(<Newsletter />)
      
      const section = screen.getByRole('region')
      const form = screen.getByRole('form')
      const input = screen.getByRole('textbox')
      const button = screen.getByRole('button')
      
      expect(section).toContainElement(form)
      expect(form).toContainElement(input)
      expect(form).toContainElement(button)
    })
  })

  describe('Form Interaction', () => {
    it('allows user to type email address', async () => {
      const user = userEvent.setup()
      render(<Newsletter />)
      
      const emailInput = screen.getByRole('textbox', { name: /your email address/i })
      await user.type(emailInput, 'test@example.com')
      
      expect(emailInput).toHaveValue('test@example.com')
    })

    it('shows required validation for empty email', async () => {
      const user = userEvent.setup()
      render(<Newsletter />)
      
      const submitButton = screen.getByRole('button', { name: /join the newsletter/i })
      const emailInput = screen.getByRole('textbox', { name: /your email address/i })
      
      await user.click(submitButton)
      
      expect(emailInput).toBeRequired()
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('shows loading state during submission', async () => {
      const user = userEvent.setup()
      // Mock a slow response to capture loading state
      mockFetch.mockImplementationOnce(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: async () => ({ msg: 'Success!' })
          }), 100)
        )
      )
      
      render(<Newsletter />)
      
      const emailInput = screen.getByRole('textbox', { name: /your email address/i })
      const submitButton = screen.getByRole('button', { name: /join the newsletter/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
      
      // Wait for loading state to appear
      await waitFor(() => {
        expect(submitButton).toBeDisabled()
        expect(emailInput).toBeDisabled()
      })
      
      // Check that button shows loading text (in the hidden desktop span)
      await waitFor(() => {
        const desktopSpan = submitButton.querySelector('.hidden.sm\\:inline')
        expect(desktopSpan).toHaveTextContent('Joining...')
      })
    })
  })

  describe('API Integration', () => {
    it('makes POST request to correct endpoint with email', async () => {
      const user = userEvent.setup()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ msg: 'Successfully subscribed!' })
      })
      
      render(<Newsletter />)
      
      const emailInput = screen.getByRole('textbox', { name: /your email address/i })
      const submitButton = screen.getByRole('button', { name: /join the newsletter/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
      
      expect(mockFetch).toHaveBeenCalledWith(
        'http://demo4687464.mockable.io/newsletter',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: 'test@example.com' })
        }
      )
    })

    it('shows success toast and clears email on successful response', async () => {
      const user = userEvent.setup()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ msg: 'Successfully subscribed!' })
      })
      
      render(<Newsletter />)
      
      const emailInput = screen.getByRole('textbox', { name: /your email address/i })
      const submitButton = screen.getByRole('button', { name: /join the newsletter/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Successfully subscribed!')
      })
      
      await waitFor(() => {
        expect(emailInput).toHaveValue('')
      })
    })

    it('shows fallback success message if API response lacks msg field', async () => {
      const user = userEvent.setup()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({})
      })
      
      render(<Newsletter />)
      
      const emailInput = screen.getByRole('textbox', { name: /your email address/i })
      const submitButton = screen.getByRole('button', { name: /join the newsletter/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith('Successfully subscribed to newsletter!')
      })
    })

    it('shows error toast on API error response', async () => {
      const user = userEvent.setup()
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ msg: 'Email already exists' })
      })
      
      render(<Newsletter />)
      
      const emailInput = screen.getByRole('textbox', { name: /your email address/i })
      const submitButton = screen.getByRole('button', { name: /join the newsletter/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Email already exists')
      })
      
      // Email should not be cleared on error
      expect(emailInput).toHaveValue('test@example.com')
    })

    it('shows fallback error message if API error response lacks msg field', async () => {
      const user = userEvent.setup()
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({})
      })
      
      render(<Newsletter />)
      
      const emailInput = screen.getByRole('textbox', { name: /your email address/i })
      const submitButton = screen.getByRole('button', { name: /join the newsletter/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Failed to subscribe to newsletter')
      })
    })

    it('shows network error toast on fetch failure', async () => {
      const user = userEvent.setup()
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
      
      render(<Newsletter />)
      
      const emailInput = screen.getByRole('textbox', { name: /your email address/i })
      const submitButton = screen.getByRole('button', { name: /join the newsletter/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Network error. Please try again later.')
      })
    })
  })

  describe('Responsive Design', () => {
    it('shows different button text on different screen sizes', () => {
      render(<Newsletter />)
      
      const button = screen.getByRole('button', { name: /join the newsletter/i })
      
      // Desktop text
      expect(button.querySelector('.hidden.sm\\:inline')).toHaveTextContent('Join The Newsletter')
      
      // Mobile text  
      expect(button.querySelector('.inline.sm\\:hidden')).toHaveTextContent('Join')
    })

    it('shows different loading text on different screen sizes', async () => {
      const user = userEvent.setup()
      mockFetch.mockImplementationOnce(() => new Promise(() => {})) // Never resolves
      
      render(<Newsletter />)
      
      const emailInput = screen.getByRole('textbox', { name: /your email address/i })
      const submitButton = screen.getByRole('button', { name: /join the newsletter/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
      
      // Check loading states
      expect(submitButton.querySelector('.hidden.sm\\:inline')).toHaveTextContent('Joining...')
      expect(submitButton.querySelector('.inline.sm\\:hidden')).toHaveTextContent('...')
    })

    it('has responsive layout classes', () => {
      render(<Newsletter />)
      
      const section = screen.getByRole('region', { name: /newsletter section/i })
      
      // Should have responsive flex direction classes
      expect(section).toHaveClass('flex', 'flex-col', 'lg:flex-row')
      
      // Should have responsive padding
      expect(section).toHaveClass('px-4', 'sm:px-6', 'md:px-8', 'lg:px-[70px]')
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', () => {
      render(<Newsletter />)
      
      expect(screen.getByRole('region', { name: /newsletter section/i })).toBeInTheDocument()
      expect(screen.getByRole('form', { name: /newsletter signup/i })).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: /your email address/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /join the newsletter/i })).toBeInTheDocument()
    })

    it('has proper input attributes', () => {
      render(<Newsletter />)
      
      const emailInput = screen.getByRole('textbox', { name: /your email address/i })
      
      expect(emailInput).toHaveAttribute('type', 'email')
      expect(emailInput).toHaveAttribute('required')
      expect(emailInput).toHaveAttribute('autoComplete', 'email')
      expect(emailInput).toHaveAttribute('placeholder', 'Your email address')
    })

    it('maintains focus management during form submission', async () => {
      const user = userEvent.setup()
      // Mock a slow response to test disabled state
      mockFetch.mockImplementationOnce(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: async () => ({ msg: 'Success!' })
          }), 100)
        )
      )
      
      render(<Newsletter />)
      
      const emailInput = screen.getByRole('textbox', { name: /your email address/i })
      const submitButton = screen.getByRole('button', { name: /join the newsletter/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
      
      // Wait for loading state - input should be disabled during submission
      await waitFor(() => {
        expect(emailInput).toBeDisabled()
        expect(submitButton).toBeDisabled()
      })
      
      // Wait for completion - inputs should be enabled again
      await waitFor(() => {
        expect(emailInput).not.toBeDisabled()
        expect(submitButton).not.toBeDisabled()
      }, { timeout: 3000 })
    })
  })

  describe('Edge Cases', () => {
    it('handles whitespace-only email gracefully', async () => {
      const user = userEvent.setup()
      render(<Newsletter />)
      
      const emailInput = screen.getByRole('textbox', { name: /your email address/i })
      const submitButton = screen.getByRole('button', { name: /join the newsletter/i })
      
      await user.type(emailInput, '   ')
      await user.click(submitButton)
      
      expect(mockFetch).not.toHaveBeenCalled()
    })

    it('handles multiple rapid submissions gracefully', async () => {
      const user = userEvent.setup()
      mockFetch.mockImplementationOnce(() => new Promise(() => {})) // Never resolves
      
      render(<Newsletter />)
      
      const emailInput = screen.getByRole('textbox', { name: /your email address/i })
      const submitButton = screen.getByRole('button', { name: /join the newsletter/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
      await user.click(submitButton)
      await user.click(submitButton)
      
      // Should only make one API call
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    it('handles malformed JSON response gracefully', async () => {
      const user = userEvent.setup()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => { throw new Error('Invalid JSON') }
      })
      
      render(<Newsletter />)
      
      const emailInput = screen.getByRole('textbox', { name: /your email address/i })
      const submitButton = screen.getByRole('button', { name: /join the newsletter/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Network error. Please try again later.')
      })
    })
  })

  describe('Form State Management', () => {
    it('restores form state after successful submission', async () => {
      const user = userEvent.setup()
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ msg: 'Success!' })
      })
      
      render(<Newsletter />)
      
      const emailInput = screen.getByRole('textbox', { name: /your email address/i })
      const submitButton = screen.getByRole('button', { name: /join the newsletter/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(emailInput).toHaveValue('')
        expect(submitButton).not.toBeDisabled()
        expect(submitButton).toHaveTextContent(/join the newsletter/i)
      })
    })

    it('restores form state after failed submission', async () => {
      const user = userEvent.setup()
      mockFetch.mockRejectedValueOnce(new Error('Network error'))
      
      render(<Newsletter />)
      
      const emailInput = screen.getByRole('textbox', { name: /your email address/i })
      const submitButton = screen.getByRole('button', { name: /join the newsletter/i })
      
      await user.type(emailInput, 'test@example.com')
      await user.click(submitButton)
      
      await waitFor(() => {
        expect(emailInput).toHaveValue('test@example.com')
        expect(submitButton).not.toBeDisabled()
        expect(submitButton).toHaveTextContent(/join the newsletter/i)
      })
    })
  })
}) 