import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import OTPConfirmPage from './page'
import { useOTPConfirm } from '@/components/features/otp-confirm/hooks/useOTPConfirm'

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

jest.mock('@/components/features/otp-confirm/hooks/useOTPConfirm')
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
const mockUseOTPConfirm = useOTPConfirm as jest.MockedFunction<typeof useOTPConfirm>

describe('OTPConfirmPage', () => {
  const defaultHookReturn = {
    otp: ['', '', '', ''],
    isResending: false,
    isVerifying: false,
    otpMethod: 'email' as const,
    isCodeComplete: false,
    handleOTPChange: jest.fn(),
    handleResendCode: jest.fn(),
    handleSubmit: jest.fn(),
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
    mockUseOTPConfirm.mockReturnValue(defaultHookReturn)
  })

  describe('Rendering', () => {
    it('should render all page elements correctly', () => {
      render(<OTPConfirmPage />)
      
      // Check header and footer
      expect(screen.getByTestId('header')).toBeInTheDocument()
      expect(screen.getByTestId('footer')).toBeInTheDocument()
      
      // Check main heading and step indicator
      expect(screen.getByText('Registration')).toBeInTheDocument()
      expect(screen.getByText('Step 3 of 3')).toBeInTheDocument()
      expect(screen.getByText('Please enter the verification code to complete your registration.')).toBeInTheDocument()
      
      // Check section heading with email method
      expect(screen.getByText('Please check your email')).toBeInTheDocument()
      
      // Check instruction text
      expect(screen.getByText('Please enter the 4-digit code we just sent to your email')).toBeInTheDocument()
      
      // Check navigation buttons
      expect(screen.getByRole('link', { name: 'Back' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
    })

    it('should render with phone method', () => {
      mockUseOTPConfirm.mockReturnValue({
        ...defaultHookReturn,
        otpMethod: 'phone',
      })
      
      render(<OTPConfirmPage />)
      
      expect(screen.getByText('Please check your phone')).toBeInTheDocument()
      expect(screen.getByText('Please enter the 4-digit code we just sent to your phone')).toBeInTheDocument()
    })

    it('should render OTP input component', () => {
      render(<OTPConfirmPage />)
      
      expect(screen.getByTestId('otp-input')).toBeInTheDocument()
    })

    it('should render resend code component', () => {
      render(<OTPConfirmPage />)
      
      expect(screen.getByTestId('resend-code')).toBeInTheDocument()
    })
  })

  describe('Form Interaction', () => {
    it('should call handleOTPChange when OTP input changes', async () => {
      const handleOTPChange = jest.fn()
      mockUseOTPConfirm.mockReturnValue({
        ...defaultHookReturn,
        handleOTPChange,
      })
      
      render(<OTPConfirmPage />)
      
      const firstInput = screen.getByTestId('otp-input-0')
      await userEvent.type(firstInput, '1')
      
      expect(handleOTPChange).toHaveBeenCalled()
    })

    it('should call handleSubmit when form is submitted', async () => {
      const handleSubmit = jest.fn()
      mockUseOTPConfirm.mockReturnValue({
        ...defaultHookReturn,
        isCodeComplete: true,
        handleSubmit,
      })
      
      render(<OTPConfirmPage />)
      
      const nextButton = screen.getByRole('button', { name: 'Next' })
      await userEvent.click(nextButton)
      
      expect(handleSubmit).toHaveBeenCalled()
    })

    it('should call handleResendCode when resend is clicked', async () => {
      const handleResendCode = jest.fn()
      mockUseOTPConfirm.mockReturnValue({
        ...defaultHookReturn,
        handleResendCode,
      })
      
      render(<OTPConfirmPage />)
      
      const resendButton = screen.getByRole('button', { name: /resend/i })
      await userEvent.click(resendButton)
      
      expect(handleResendCode).toHaveBeenCalled()
    })
  })

  describe('Button States', () => {
    it('should disable Next button when code is incomplete', () => {
      mockUseOTPConfirm.mockReturnValue({
        ...defaultHookReturn,
        isCodeComplete: false,
      })
      
      render(<OTPConfirmPage />)
      
      const nextButton = screen.getByRole('button', { name: 'Next' })
      expect(nextButton).toBeDisabled()
    })

    it('should enable Next button when code is complete', () => {
      mockUseOTPConfirm.mockReturnValue({
        ...defaultHookReturn,
        isCodeComplete: true,
      })
      
      render(<OTPConfirmPage />)
      
      const nextButton = screen.getByRole('button', { name: 'Next' })
      expect(nextButton).not.toBeDisabled()
    })

    it('should disable Next button and show loading text when verifying', () => {
      mockUseOTPConfirm.mockReturnValue({
        ...defaultHookReturn,
        isCodeComplete: true,
        isVerifying: true,
      })
      
      render(<OTPConfirmPage />)
      
      const nextButton = screen.getByRole('button', { name: 'Verifying...' })
      expect(nextButton).toBeDisabled()
    })

    it('should disable OTP input when verifying', () => {
      mockUseOTPConfirm.mockReturnValue({
        ...defaultHookReturn,
        isVerifying: true,
      })
      
      render(<OTPConfirmPage />)
      
      const otpInputs = screen.getAllByRole('textbox')
      otpInputs.forEach(input => {
        expect(input).toBeDisabled()
      })
    })
  })

  describe('Navigation', () => {
    it('should navigate back to otp-send when Back button is clicked', async () => {
      render(<OTPConfirmPage />)
      
      const backLink = screen.getByRole('link', { name: 'Back' })
      await userEvent.click(backLink)
      
      // The back button uses Link component, so we check the href
      expect(backLink).toHaveAttribute('href', '/otp-send')
    })
  })

  describe('Loading States', () => {
    it('should show resending state when resending code', () => {
      mockUseOTPConfirm.mockReturnValue({
        ...defaultHookReturn,
        isResending: true,
      })
      
      render(<OTPConfirmPage />)
      
      expect(screen.getByText('Sending code...')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper heading structure', () => {
      render(<OTPConfirmPage />)
      
      const h1 = screen.getByRole('heading', { level: 1, name: 'Registration' })
      const h2 = screen.getByRole('heading', { level: 2, name: /Please check your/ })
      
      expect(h1).toBeInTheDocument()
      expect(h2).toBeInTheDocument()
    })

    it('should have form element for OTP input', () => {
      render(<OTPConfirmPage />)
      
      const form = document.querySelector('form')
      expect(form).toBeInTheDocument()
    })

    it('should have proper button and link roles', () => {
      render(<OTPConfirmPage />)
      
      expect(screen.getByRole('link', { name: 'Back' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive classes', () => {
      render(<OTPConfirmPage />)
      
      const mainContent = screen.getByRole('main')
      expect(mainContent).toHaveClass('px-4', 'sm:px-6', 'lg:px-8')
    })
  })

  describe('Error Handling', () => {
    it('should handle hook errors gracefully', () => {
      // Mock console.error to avoid noise in tests
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
      
      mockUseOTPConfirm.mockImplementation(() => {
        throw new Error('Hook error')
      })
      
      expect(() => render(<OTPConfirmPage />)).toThrow('Hook error')
      
      consoleSpy.mockRestore()
    })
  })

  describe('Integration', () => {
    it('should pass correct props to OTP input component', () => {
      const otp = ['1', '2', '', '']
      const handleOTPChange = jest.fn()
      
      mockUseOTPConfirm.mockReturnValue({
        ...defaultHookReturn,
        otp,
        isVerifying: true,
        handleOTPChange,
      })
      
      render(<OTPConfirmPage />)
      
      // Check that OTP values are displayed
      expect(screen.getByDisplayValue('1')).toBeInTheDocument()
      expect(screen.getByDisplayValue('2')).toBeInTheDocument()
      
      // Check that inputs are disabled when verifying
      const otpInputs = screen.getAllByRole('textbox')
      otpInputs.forEach(input => {
        expect(input).toBeDisabled()
      })
    })

    it('should pass correct props to resend code component', () => {
      const handleResendCode = jest.fn()
      
      mockUseOTPConfirm.mockReturnValue({
        ...defaultHookReturn,
        isResending: true,
        handleResendCode,
      })
      
      render(<OTPConfirmPage />)
      
      // Check that resending state is passed
      expect(screen.getByText('Sending code...')).toBeInTheDocument()
    })
  })
}) 