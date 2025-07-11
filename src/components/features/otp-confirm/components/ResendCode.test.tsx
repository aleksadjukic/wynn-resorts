import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ResendCode } from './ResendCode'

describe('ResendCode', () => {
  const defaultProps = {
    isResending: false,
    onResend: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<ResendCode {...defaultProps} />)
      
      expect(screen.getByTestId('resend-code')).toBeInTheDocument()
      expect(screen.getByText("Didn't get a code?")).toBeInTheDocument()
      expect(screen.getByTestId('resend-code-button')).toBeInTheDocument()
    })

    it('should render with custom test ID', () => {
      render(<ResendCode {...defaultProps} data-testid="custom-resend" />)
      
      expect(screen.getByTestId('custom-resend')).toBeInTheDocument()
      expect(screen.getByTestId('custom-resend-button')).toBeInTheDocument()
    })

    it('should show resend button when not resending', () => {
      render(<ResendCode {...defaultProps} isResending={false} />)
      
      expect(screen.getByTestId('resend-code-button')).toBeInTheDocument()
      expect(screen.getByText('Resend code')).toBeInTheDocument()
      expect(screen.queryByTestId('resend-code-loading')).not.toBeInTheDocument()
    })

    it('should show loading state when resending', () => {
      render(<ResendCode {...defaultProps} isResending={true} />)
      
      expect(screen.getByTestId('resend-code-loading')).toBeInTheDocument()
      expect(screen.getByText('Sending code...')).toBeInTheDocument()
      expect(screen.queryByTestId('resend-code-button')).not.toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should call onResend when button is clicked', async () => {
      const onResend = jest.fn()
      const user = userEvent.setup()
      
      render(<ResendCode {...defaultProps} onResend={onResend} />)
      
      const resendButton = screen.getByTestId('resend-code-button')
      await user.click(resendButton)
      
      expect(onResend).toHaveBeenCalledTimes(1)
    })

    it('should not call onResend when in loading state', () => {
      const onResend = jest.fn()
      
      render(<ResendCode {...defaultProps} onResend={onResend} isResending={true} />)
      
      // Button should not be present when loading
      expect(screen.queryByTestId('resend-code-button')).not.toBeInTheDocument()
      expect(onResend).not.toHaveBeenCalled()
    })

    it('should handle multiple clicks', async () => {
      const onResend = jest.fn()
      const user = userEvent.setup()
      
      render(<ResendCode {...defaultProps} onResend={onResend} />)
      
      const resendButton = screen.getByTestId('resend-code-button')
      await user.click(resendButton)
      await user.click(resendButton)
      
      expect(onResend).toHaveBeenCalledTimes(2)
    })
  })

  describe('Styling', () => {
    it('should have correct container styling', () => {
      render(<ResendCode {...defaultProps} />)
      
      const container = screen.getByTestId('resend-code')
      expect(container).toHaveClass('text-center')
    })

    it('should have correct prompt text styling', () => {
      render(<ResendCode {...defaultProps} />)
      
      const promptText = screen.getByText("Didn't get a code?")
      expect(promptText).toHaveClass('text-sm', 'text-gray-500', 'mb-4')
    })

    it('should have correct button styling', () => {
      render(<ResendCode {...defaultProps} />)
      
      const button = screen.getByTestId('resend-code-button')
      expect(button).toHaveClass('text-sm', 'text-[#006F62]', 'hover:underline')
    })

    it('should have correct loading text styling', () => {
      render(<ResendCode {...defaultProps} isResending={true} />)
      
      const loadingText = screen.getByTestId('resend-code-loading')
      expect(loadingText).toHaveClass('text-sm', 'text-gray-500')
    })
  })

  describe('Accessibility', () => {
    it('should have proper button attributes', () => {
      render(<ResendCode {...defaultProps} />)
      
      const button = screen.getByTestId('resend-code-button')
      expect(button).toHaveAttribute('type', 'button')
      expect(button.tagName).toBe('BUTTON')
    })

    it('should be keyboard accessible', async () => {
      const onResend = jest.fn()
      const user = userEvent.setup()
      
      render(<ResendCode {...defaultProps} onResend={onResend} />)
      
      const button = screen.getByTestId('resend-code-button')
      
      // Focus and activate with Enter
      button.focus()
      await user.keyboard('{Enter}')
      
      expect(onResend).toHaveBeenCalled()
    })

    it('should be activatable with Space key', async () => {
      const onResend = jest.fn()
      const user = userEvent.setup()
      
      render(<ResendCode {...defaultProps} onResend={onResend} />)
      
      const button = screen.getByTestId('resend-code-button')
      
      button.focus()
      await user.keyboard(' ')
      
      expect(onResend).toHaveBeenCalled()
    })
  })

  describe('State Changes', () => {
    it('should toggle between button and loading state', () => {
      const { rerender } = render(<ResendCode {...defaultProps} isResending={false} />)
      
      expect(screen.getByTestId('resend-code-button')).toBeInTheDocument()
      expect(screen.queryByTestId('resend-code-loading')).not.toBeInTheDocument()
      
      rerender(<ResendCode {...defaultProps} isResending={true} />)
      
      expect(screen.queryByTestId('resend-code-button')).not.toBeInTheDocument()
      expect(screen.getByTestId('resend-code-loading')).toBeInTheDocument()
    })

    it('should maintain prompt text in both states', () => {
      const { rerender } = render(<ResendCode {...defaultProps} isResending={false} />)
      
      expect(screen.getByText("Didn't get a code?")).toBeInTheDocument()
      
      rerender(<ResendCode {...defaultProps} isResending={true} />)
      
      expect(screen.getByText("Didn't get a code?")).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle rapid state changes', () => {
      const { rerender } = render(<ResendCode {...defaultProps} isResending={false} />)
      
      // Rapidly toggle state
      for (let i = 0; i < 5; i++) {
        rerender(<ResendCode {...defaultProps} isResending={true} />)
        rerender(<ResendCode {...defaultProps} isResending={false} />)
      }
      
      expect(screen.getByTestId('resend-code-button')).toBeInTheDocument()
    })

    it('should handle undefined onResend gracefully', async () => {
      const user = userEvent.setup()
      
      render(<ResendCode isResending={false} onResend={undefined as any} />)
      
      const button = screen.getByTestId('resend-code-button')
      
      // Should not throw when clicked
      await expect(user.click(button)).resolves.toBeUndefined()
    })

    it('should preserve test IDs across state changes', () => {
      const { rerender } = render(
        <ResendCode {...defaultProps} isResending={false} data-testid="custom-resend" />
      )
      
      expect(screen.getByTestId('custom-resend')).toBeInTheDocument()
      
      rerender(
        <ResendCode {...defaultProps} isResending={true} data-testid="custom-resend" />
      )
      
      expect(screen.getByTestId('custom-resend')).toBeInTheDocument()
      expect(screen.getByTestId('custom-resend-loading')).toBeInTheDocument()
    })
  })
}) 