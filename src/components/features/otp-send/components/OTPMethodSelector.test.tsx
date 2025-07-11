import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OTPMethodSelector, OTPMethod } from './OTPMethodSelector'

// Mock UI components
jest.mock('@/components/ui/label', () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>
}))

describe('OTPMethodSelector', () => {
  const defaultProps = {
    selectedMethod: '' as OTPMethod,
    onMethodChange: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<OTPMethodSelector {...defaultProps} />)
      
      expect(screen.getByTestId('otp-method-selector')).toBeInTheDocument()
      expect(screen.getByText('OTP Verification')).toBeInTheDocument()
      expect(screen.getByText('Send OTP')).toBeInTheDocument()
      expect(screen.getByText('How would you like to receive the code?')).toBeInTheDocument()
    })

    it('should render both radio options', () => {
      render(<OTPMethodSelector {...defaultProps} />)
      
      expect(screen.getByTestId('otp-method-selector-phone-radio')).toBeInTheDocument()
      expect(screen.getByTestId('otp-method-selector-email-radio')).toBeInTheDocument()
      expect(screen.getByText('Send to Phone')).toBeInTheDocument()
      expect(screen.getByText('Send to Email')).toBeInTheDocument()
    })

    it('should render with custom test ID', () => {
      render(<OTPMethodSelector {...defaultProps} data-testid="custom-selector" />)
      
      expect(screen.getByTestId('custom-selector')).toBeInTheDocument()
      expect(screen.getByTestId('custom-selector-phone-radio')).toBeInTheDocument()
      expect(screen.getByTestId('custom-selector-email-radio')).toBeInTheDocument()
    })


  })

  describe('Selection State', () => {
    it('should show email as selected when selectedMethod is email', () => {
      render(<OTPMethodSelector {...defaultProps} selectedMethod="email" />)
      
      const emailRadio = screen.getByTestId('otp-method-selector-email-radio')
      const phoneRadio = screen.getByTestId('otp-method-selector-phone-radio')
      
      expect(emailRadio).toBeChecked()
      expect(phoneRadio).not.toBeChecked()
    })

    it('should show phone as selected when selectedMethod is phone', () => {
      render(<OTPMethodSelector {...defaultProps} selectedMethod="phone" />)
      
      const emailRadio = screen.getByTestId('otp-method-selector-email-radio')
      const phoneRadio = screen.getByTestId('otp-method-selector-phone-radio')
      
      expect(phoneRadio).toBeChecked()
      expect(emailRadio).not.toBeChecked()
    })

    it('should show no selection when selectedMethod is empty', () => {
      render(<OTPMethodSelector {...defaultProps} selectedMethod="" />)
      
      const emailRadio = screen.getByTestId('otp-method-selector-email-radio')
      const phoneRadio = screen.getByTestId('otp-method-selector-phone-radio')
      
      expect(emailRadio).not.toBeChecked()
      expect(phoneRadio).not.toBeChecked()
    })
  })

  describe('User Interactions', () => {
    it('should call onMethodChange when email radio is clicked', async () => {
      const onMethodChange = jest.fn()
      const user = userEvent.setup()
      
      render(<OTPMethodSelector {...defaultProps} onMethodChange={onMethodChange} />)
      
      const emailRadio = screen.getByTestId('otp-method-selector-email-radio')
      await user.click(emailRadio)
      
      expect(onMethodChange).toHaveBeenCalledWith('email')
      expect(onMethodChange).toHaveBeenCalledTimes(1)
    })

    it('should call onMethodChange when phone radio is clicked', async () => {
      const onMethodChange = jest.fn()
      const user = userEvent.setup()
      
      render(<OTPMethodSelector {...defaultProps} onMethodChange={onMethodChange} />)
      
      const phoneRadio = screen.getByTestId('otp-method-selector-phone-radio')
      await user.click(phoneRadio)
      
      expect(onMethodChange).toHaveBeenCalledWith('phone')
      expect(onMethodChange).toHaveBeenCalledTimes(1)
    })

    it('should call onMethodChange when clicking labels', async () => {
      const onMethodChange = jest.fn()
      const user = userEvent.setup()
      
      render(<OTPMethodSelector {...defaultProps} onMethodChange={onMethodChange} />)
      
      const emailLabel = screen.getByText('Send to Email')
      await user.click(emailLabel)
      
      expect(onMethodChange).toHaveBeenCalledWith('email')
    })

    it('should handle onChange event directly', () => {
      const onMethodChange = jest.fn()
      
      render(<OTPMethodSelector {...defaultProps} onMethodChange={onMethodChange} />)
      
      const phoneRadio = screen.getByTestId('otp-method-selector-phone-radio')
      fireEvent.click(phoneRadio)
      
      expect(onMethodChange).toHaveBeenCalledWith('phone')
    })
  })

  describe('Loading State', () => {
    it('should disable radio buttons when loading', () => {
      render(<OTPMethodSelector {...defaultProps} isLoading={true} />)
      
      const emailRadio = screen.getByTestId('otp-method-selector-email-radio')
      const phoneRadio = screen.getByTestId('otp-method-selector-phone-radio')
      
      expect(emailRadio).toBeDisabled()
      expect(phoneRadio).toBeDisabled()
    })

    it('should enable radio buttons when not loading', () => {
      render(<OTPMethodSelector {...defaultProps} isLoading={false} />)
      
      const emailRadio = screen.getByTestId('otp-method-selector-email-radio')
      const phoneRadio = screen.getByTestId('otp-method-selector-phone-radio')
      
      expect(emailRadio).not.toBeDisabled()
      expect(phoneRadio).not.toBeDisabled()
    })

    it('should not call onMethodChange when disabled and clicked', async () => {
      const onMethodChange = jest.fn()
      const user = userEvent.setup()
      
      render(<OTPMethodSelector {...defaultProps} onMethodChange={onMethodChange} isLoading={true} />)
      
      const emailRadio = screen.getByTestId('otp-method-selector-email-radio')
      await user.click(emailRadio)
      
      expect(onMethodChange).not.toHaveBeenCalled()
    })
  })

  describe('Accessibility', () => {
    it('should have proper radio group structure', () => {
      render(<OTPMethodSelector {...defaultProps} />)
      
      const emailRadio = screen.getByTestId('otp-method-selector-email-radio')
      const phoneRadio = screen.getByTestId('otp-method-selector-phone-radio')
      
      expect(emailRadio).toHaveAttribute('type', 'radio')
      expect(phoneRadio).toHaveAttribute('type', 'radio')
      expect(emailRadio).toHaveAttribute('name', 'otpMethod')
      expect(phoneRadio).toHaveAttribute('name', 'otpMethod')
    })

    it('should have proper labels associated with inputs', () => {
      render(<OTPMethodSelector {...defaultProps} />)
      
      const emailRadio = screen.getByTestId('otp-method-selector-email-radio')
      const phoneRadio = screen.getByTestId('otp-method-selector-phone-radio')
      
      expect(emailRadio).toHaveAttribute('id', 'email')
      expect(phoneRadio).toHaveAttribute('id', 'phone')
      
      const emailLabel = screen.getByLabelText(/Send to Email/)
      const phoneLabel = screen.getByLabelText(/Send to Phone/)
      
      expect(emailLabel).toBe(emailRadio)
      expect(phoneLabel).toBe(phoneRadio)
    })

    it('should have proper focus styles', () => {
      render(<OTPMethodSelector {...defaultProps} />)
      
      const emailRadio = screen.getByTestId('otp-method-selector-email-radio')
      const phoneRadio = screen.getByTestId('otp-method-selector-phone-radio')
      
      expect(emailRadio).toHaveClass('focus:ring-[#006F62]')
      expect(phoneRadio).toHaveClass('focus:ring-[#006F62]')
    })
  })

  describe('Styling', () => {
    it('should have correct CSS classes', () => {
      render(<OTPMethodSelector {...defaultProps} />)
      
      const container = screen.getByTestId('otp-method-selector')
      expect(container).toHaveClass('mb-8')
      
      const options = screen.getByTestId('otp-method-selector-options')
      expect(options).toHaveClass('space-y-4', 'flex', 'justify-center', 'gap-8')
    })


  })
}) 