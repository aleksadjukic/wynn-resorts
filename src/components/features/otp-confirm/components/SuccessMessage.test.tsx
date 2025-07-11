import { render, screen } from '@testing-library/react'
import { SuccessMessage } from './SuccessMessage'

describe('SuccessMessage', () => {
  describe('Rendering', () => {
    it('should render with message', () => {
      render(<SuccessMessage message="OTP sent successfully" />)
      
      expect(screen.getByTestId('success-message')).toBeInTheDocument()
      expect(screen.getByTestId('success-message-text')).toHaveTextContent('OTP sent successfully')
    })

    it('should render with custom test ID', () => {
      render(<SuccessMessage message="Test message" data-testid="custom-success" />)
      
      expect(screen.getByTestId('custom-success')).toBeInTheDocument()
      expect(screen.getByTestId('custom-success-text')).toHaveTextContent('Test message')
    })

    it('should not render when message is empty', () => {
      render(<SuccessMessage message="" />)
      
      expect(screen.queryByTestId('success-message')).not.toBeInTheDocument()
    })

    it('should not render when message is undefined', () => {
      render(<SuccessMessage message={undefined as any} />)
      
      expect(screen.queryByTestId('success-message')).not.toBeInTheDocument()
    })
  })

  describe('Styling', () => {
    it('should have correct container styling', () => {
      render(<SuccessMessage message="Test message" />)
      
      const container = screen.getByTestId('success-message')
      expect(container).toHaveClass('bg-green-50', 'border', 'border-green-200', 'rounded-lg', 'p-4', 'mb-6')
    })

    it('should have correct text styling', () => {
      render(<SuccessMessage message="Test message" />)
      
      const text = screen.getByTestId('success-message-text')
      expect(text).toHaveClass('text-[16px]', 'text-[#006F62]', 'font-medium')
    })
  })

  describe('Content', () => {
    it('should display exact message text', () => {
      const message = "Your verification code has been sent to your email address"
      render(<SuccessMessage message={message} />)
      
      expect(screen.getByTestId('success-message-text')).toHaveTextContent(message)
    })

    it('should handle long messages', () => {
      const longMessage = "This is a very long success message that contains multiple words and should be displayed correctly without any truncation or modification of the original text content"
      render(<SuccessMessage message={longMessage} />)
      
      expect(screen.getByTestId('success-message-text')).toHaveTextContent(longMessage)
    })

    it('should handle special characters', () => {
      const specialMessage = "OTP sent to user@example.com! Check your inbox (100% success rate)"
      render(<SuccessMessage message={specialMessage} />)
      
      expect(screen.getByTestId('success-message-text')).toHaveTextContent(specialMessage)
    })

    it('should handle whitespace-only messages', () => {
      render(<SuccessMessage message="   " />)
      
      expect(screen.getByTestId('success-message')).toBeInTheDocument()
      expect(screen.getByTestId('success-message-text')).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have proper structure', () => {
      render(<SuccessMessage message="Success message" />)
      
      const container = screen.getByTestId('success-message')
      const text = screen.getByTestId('success-message-text')
      
      expect(container).toContainElement(text)
      expect(text.tagName).toBe('P')
    })

    it('should be readable with success styling', () => {
      render(<SuccessMessage message="Success message" />)
      
      const text = screen.getByTestId('success-message-text')
      expect(text).toHaveClass('text-[#006F62]') // Green text for success
    })
  })

  describe('Edge Cases', () => {
    it('should handle null message gracefully', () => {
      render(<SuccessMessage message={null as any} />)
      
      expect(screen.queryByTestId('success-message')).not.toBeInTheDocument()
    })

    it('should handle numeric message', () => {
      render(<SuccessMessage message={123 as any} />)
      
      expect(screen.getByTestId('success-message-text')).toHaveTextContent('123')
    })

    it('should re-render when message changes', () => {
      const { rerender } = render(<SuccessMessage message="First message" />)
      
      expect(screen.getByTestId('success-message-text')).toHaveTextContent('First message')
      
      rerender(<SuccessMessage message="Second message" />)
      
      expect(screen.getByTestId('success-message-text')).toHaveTextContent('Second message')
    })

    it('should hide when message becomes empty', () => {
      const { rerender } = render(<SuccessMessage message="Visible message" />)
      
      expect(screen.getByTestId('success-message')).toBeInTheDocument()
      
      rerender(<SuccessMessage message="" />)
      
      expect(screen.queryByTestId('success-message')).not.toBeInTheDocument()
    })
  })
}) 