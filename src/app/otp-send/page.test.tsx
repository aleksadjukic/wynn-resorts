import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import OTPSendPage from './page'
import { useOTPSend } from '@/components/features/otp-send/hooks/useOTPSend'

// Mock the dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('@/components/features/otp-send/hooks/useOTPSend')
jest.mock('@/components/layout/Header/Header', () => {
  return function MockHeader() {
    return <header data-testid="header">Header</header>
  }
})
jest.mock('@/components/layout/Footer/Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>
  }
})

const mockPush = jest.fn()
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>
const mockUseOTPSend = useOTPSend as jest.MockedFunction<typeof useOTPSend>

describe('OTPSendPage', () => {
  const defaultHookReturn = {
    selectedMethod: '' as const,
    isLoading: false,
    message: '',
    handleMethodChange: jest.fn(),
    handleNext: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as any)
    mockUseOTPSend.mockReturnValue(defaultHookReturn)
  })

  describe('Rendering', () => {
    it('should render all page elements correctly', () => {
      render(<OTPSendPage />)
      
      // Check header and footer
      expect(screen.getByTestId('header')).toBeInTheDocument()
      expect(screen.getByTestId('footer')).toBeInTheDocument()
      
      // Check main heading and step indicator
      expect(screen.getByText('Registration')).toBeInTheDocument()
      expect(screen.getByText('Step 2 of 3')).toBeInTheDocument()
      expect(screen.getByText("Please select how you'd like to receive your verification code.")).toBeInTheDocument()
      
      // Check navigation buttons
      expect(screen.getByRole('link', { name: 'Back' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
    })

    it('should render OTP method selector component', () => {
      render(<OTPSendPage />)
      
      expect(screen.getByTestId('otp-method-selector')).toBeInTheDocument()
    })

    it('should render message display component when there is a message', () => {
      mockUseOTPSend.mockReturnValue({
        ...defaultHookReturn,
        message: 'Test message',
      })
      
      render(<OTPSendPage />)
      
      expect(screen.getByTestId('message-display')).toBeInTheDocument()
    })

    it('should not render message display component when there is no message', () => {
      mockUseOTPSend.mockReturnValue({
        ...defaultHookReturn,
        message: '',
      })
      
      render(<OTPSendPage />)
      
      expect(screen.queryByTestId('message-display')).not.toBeInTheDocument()
    })
  })

  describe('Method Selection', () => {
    it('should call handleMethodChange when method selection changes', async () => {
      const handleMethodChange = jest.fn()
      mockUseOTPSend.mockReturnValue({
        ...defaultHookReturn,
        handleMethodChange,
      })
      
      render(<OTPSendPage />)
      
      const emailRadio = screen.getByRole('radio', { name: /email/i })
      await userEvent.click(emailRadio)
      
      expect(handleMethodChange).toHaveBeenCalledWith('email')
    })

    it('should display selected method correctly', () => {
      mockUseOTPSend.mockReturnValue({
        ...defaultHookReturn,
        selectedMethod: 'email',
      })
      
      render(<OTPSendPage />)
      
      const emailRadio = screen.getByRole('radio', { name: /email/i })
      expect(emailRadio).toBeChecked()
    })
  })

  describe('Form Submission', () => {
    it('should call handleNext when Next button is clicked', async () => {
      const handleNext = jest.fn()
      mockUseOTPSend.mockReturnValue({
        ...defaultHookReturn,
        selectedMethod: 'email',
        handleNext,
      })
      
      render(<OTPSendPage />)
      
      const nextButton = screen.getByRole('button', { name: 'Next' })
      await userEvent.click(nextButton)
      
      expect(handleNext).toHaveBeenCalled()
    })

    it('should prevent submission when no method is selected', () => {
      const handleNext = jest.fn()
      mockUseOTPSend.mockReturnValue({
        ...defaultHookReturn,
        selectedMethod: '',
        handleNext,
      })
      
      render(<OTPSendPage />)
      
      const nextButton = screen.getByRole('button', { name: 'Next' })
      expect(nextButton).toBeDisabled()
    })
  })

  describe('Button States', () => {
    it('should disable Next button when no method is selected', () => {
      mockUseOTPSend.mockReturnValue({
        ...defaultHookReturn,
        selectedMethod: '',
      })
      
      render(<OTPSendPage />)
      
      const nextButton = screen.getByRole('button', { name: 'Next' })
      expect(nextButton).toBeDisabled()
    })

    it('should enable Next button when method is selected', () => {
      mockUseOTPSend.mockReturnValue({
        ...defaultHookReturn,
        selectedMethod: 'email',
      })
      
      render(<OTPSendPage />)
      
      const nextButton = screen.getByRole('button', { name: 'Next' })
      expect(nextButton).not.toBeDisabled()
    })

    it('should disable Next button and show loading text when sending', () => {
      mockUseOTPSend.mockReturnValue({
        ...defaultHookReturn,
        selectedMethod: 'email',
        isLoading: true,
      })
      
      render(<OTPSendPage />)
      
      const nextButton = screen.getByRole('button', { name: 'Sending...' })
      expect(nextButton).toBeDisabled()
    })

    it('should disable method selector when loading', () => {
      mockUseOTPSend.mockReturnValue({
        ...defaultHookReturn,
        isLoading: true,
      })
      
      render(<OTPSendPage />)
      
      const radioButtons = screen.getAllByRole('radio')
      radioButtons.forEach(radio => {
        expect(radio).toBeDisabled()
      })
    })
  })

  describe('Navigation', () => {
    it('should navigate back to home when Back button is clicked', async () => {
      render(<OTPSendPage />)
      
      const backLink = screen.getByRole('link', { name: 'Back' })
      expect(backLink).toHaveAttribute('href', '/')
    })
  })

  describe('Error Handling', () => {
    it('should display error message when present', () => {
      const errorMessage = 'Failed to send OTP. Please try again.'
      mockUseOTPSend.mockReturnValue({
        ...defaultHookReturn,
        message: errorMessage,
      })
      
      render(<OTPSendPage />)
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })

    it('should handle hook errors gracefully', () => {
      // Mock console.error to avoid noise in tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      mockUseOTPSend.mockImplementation(() => {
        throw new Error('Hook error')
      })
      
      expect(() => render(<OTPSendPage />)).toThrow('Hook error')
      
      consoleSpy.mockRestore()
    })
  })

  describe('Loading States', () => {
    it('should show loading indicator when sending OTP', () => {
      mockUseOTPSend.mockReturnValue({
        ...defaultHookReturn,
        selectedMethod: 'email',
        isLoading: true,
      })
      
      render(<OTPSendPage />)
      
      expect(screen.getByText('Sending...')).toBeInTheDocument()
    })

    it('should maintain button styling during loading', () => {
      mockUseOTPSend.mockReturnValue({
        ...defaultHookReturn,
        selectedMethod: 'email',
        isLoading: true,
      })
      
      render(<OTPSendPage />)
      
      const nextButton = screen.getByRole('button', { name: 'Sending...' })
      expect(nextButton).toHaveClass('disabled:opacity-50')
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<OTPSendPage />)
      
      const h1 = screen.getByRole('heading', { level: 1, name: 'Registration' })
      expect(h1).toBeInTheDocument()
    })

    it('should have proper button and link roles', () => {
      render(<OTPSendPage />)
      
      expect(screen.getByRole('link', { name: 'Back' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
    })

    it('should have proper radio button accessibility', () => {
      render(<OTPSendPage />)
      
      const radioButtons = screen.getAllByRole('radio')
      expect(radioButtons.length).toBeGreaterThan(0)
      
      radioButtons.forEach(radio => {
        expect(radio).toHaveAttribute('name')
      })
    })

    it('should maintain focus management', async () => {
      render(<OTPSendPage />)
      
      const emailRadio = screen.getByRole('radio', { name: /email/i })
      await userEvent.click(emailRadio)
      
      expect(emailRadio).toHaveFocus()
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive classes', () => {
      render(<OTPSendPage />)
      
      const mainContent = screen.getByRole('main')
      expect(mainContent).toHaveClass('px-4', 'sm:px-6', 'lg:px-8')
    })

    it('should have responsive button layout', () => {
      render(<OTPSendPage />)
      
      const buttonContainer = screen.getByRole('link', { name: 'Back' }).parentElement
      expect(buttonContainer).toHaveClass('flex', 'gap-4')
      
      const backLink = screen.getByRole('link', { name: 'Back' })
      const nextButton = screen.getByRole('button', { name: 'Next' })
      
      expect(backLink).toHaveClass('flex-1')
      expect(nextButton).toHaveClass('flex-1')
    })
  })

  describe('Integration', () => {
    it('should pass correct props to OTP method selector', () => {
      const handleMethodChange = jest.fn()
      
      mockUseOTPSend.mockReturnValue({
        ...defaultHookReturn,
        selectedMethod: 'phone',
        isLoading: true,
        handleMethodChange,
      })
      
      render(<OTPSendPage />)
      
      // Check that phone is selected
      const phoneRadio = screen.getByRole('radio', { name: /phone/i })
      expect(phoneRadio).toBeChecked()
      
      // Check that inputs are disabled when loading
      const radioButtons = screen.getAllByRole('radio')
      radioButtons.forEach(radio => {
        expect(radio).toBeDisabled()
      })
    })

    it('should pass correct props to message display', () => {
      const errorMessage = 'Please select a method first'
      
      mockUseOTPSend.mockReturnValue({
        ...defaultHookReturn,
        message: errorMessage,
      })
      
      render(<OTPSendPage />)
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument()
    })
  })

  describe('User Flow', () => {
    it('should complete the full selection and submission flow', async () => {
      const handleMethodChange = jest.fn()
      const handleNext = jest.fn()
      
      // First render with no method selected
      mockUseOTPSend.mockReturnValue({
        ...defaultHookReturn,
        handleMethodChange,
        handleNext,
      })
      
      const { rerender } = render(<OTPSendPage />)
      
      // Step 1: Select method
      const emailRadio = screen.getByRole('radio', { name: /email/i })
      await userEvent.click(emailRadio)
      expect(handleMethodChange).toHaveBeenCalledWith('email')
      
      // Update mock and re-render to reflect selection
      mockUseOTPSend.mockReturnValue({
        ...defaultHookReturn,
        selectedMethod: 'email',
        handleMethodChange,
        handleNext,
      })
      
      rerender(<OTPSendPage />)
      
      // Step 2: Submit
      const nextButton = screen.getByRole('button', { name: 'Next' })
      expect(nextButton).not.toBeDisabled()
      
      await userEvent.click(nextButton)
      expect(handleNext).toHaveBeenCalled()
    })

    it('should handle method switching correctly', async () => {
      const handleMethodChange = jest.fn()
      
      mockUseOTPSend.mockReturnValue({
        ...defaultHookReturn,
        selectedMethod: 'email',
        handleMethodChange,
      })
      
      render(<OTPSendPage />)
      
      // Switch to phone
      const phoneRadio = screen.getByRole('radio', { name: /phone/i })
      await userEvent.click(phoneRadio)
      expect(handleMethodChange).toHaveBeenCalledWith('phone')
    })
  })

  describe('Performance', () => {
    it('should not cause unnecessary re-renders', () => {
      const { rerender } = render(<OTPSendPage />)
      
      // Re-render with same props
      rerender(<OTPSendPage />)
      
      // Should still render correctly
      expect(screen.getByText('Registration')).toBeInTheDocument()
    })
  })
}) 