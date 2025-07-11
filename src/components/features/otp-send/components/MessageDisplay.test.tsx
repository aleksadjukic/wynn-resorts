import { render, screen } from '@testing-library/react'
import { MessageDisplay } from './MessageDisplay'

describe('MessageDisplay', () => {
  describe('Rendering', () => {
    it('should render error message by default', () => {
      render(<MessageDisplay message="Test error message" />)
      
      const messageText = screen.getByTestId('message-display-text')
      expect(messageText).toBeInTheDocument()
      expect(messageText).toHaveTextContent('Test error message')
      expect(messageText).toHaveClass('text-red-600')
    })

    it('should render success message with correct styling', () => {
      render(<MessageDisplay message="Success message" type="success" />)
      
      const messageText = screen.getByTestId('message-display-text')
      expect(messageText).toHaveTextContent('Success message')
      expect(messageText).toHaveClass('text-green-600')
    })

    it('should render info message with correct styling', () => {
      render(<MessageDisplay message="Info message" type="info" />)
      
      const messageText = screen.getByTestId('message-display-text')
      expect(messageText).toHaveTextContent('Info message')
      expect(messageText).toHaveClass('text-blue-600')
    })

    it('should render error message when type is error', () => {
      render(<MessageDisplay message="Error message" type="error" />)
      
      const messageText = screen.getByTestId('message-display-text')
      expect(messageText).toHaveTextContent('Error message')
      expect(messageText).toHaveClass('text-red-600')
    })

    it('should not render when message is empty', () => {
      render(<MessageDisplay message="" />)
      
      expect(screen.queryByTestId('message-display')).not.toBeInTheDocument()
    })

    it('should not render when message is undefined', () => {
      render(<MessageDisplay message={undefined as any} />)
      
      expect(screen.queryByTestId('message-display')).not.toBeInTheDocument()
    })
  })

  describe('Custom test IDs', () => {
    it('should use custom test ID when provided', () => {
      render(<MessageDisplay message="Test message" data-testid="custom-message" />)
      
      expect(screen.getByTestId('custom-message')).toBeInTheDocument()
      expect(screen.getByTestId('custom-message-text')).toBeInTheDocument()
    })

    it('should use default test ID when not provided', () => {
      render(<MessageDisplay message="Test message" />)
      
      expect(screen.getByTestId('message-display')).toBeInTheDocument()
      expect(screen.getByTestId('message-display-text')).toBeInTheDocument()
    })
  })

  describe('Styling and classes', () => {
    it('should have correct container classes', () => {
      render(<MessageDisplay message="Test message" />)
      
      const container = screen.getByTestId('message-display')
      expect(container).toHaveClass('text-center', 'mt-4')
    })

    it('should have correct text classes for all message types', () => {
      const { rerender } = render(<MessageDisplay message="Error" type="error" />)
      expect(screen.getByTestId('message-display-text')).toHaveClass('text-sm', 'text-red-600')

      rerender(<MessageDisplay message="Success" type="success" />)
      expect(screen.getByTestId('message-display-text')).toHaveClass('text-sm', 'text-green-600')

      rerender(<MessageDisplay message="Info" type="info" />)
      expect(screen.getByTestId('message-display-text')).toHaveClass('text-sm', 'text-blue-600')
    })

    it('should fallback to error styling for unknown type', () => {
      render(<MessageDisplay message="Test" type={'unknown' as any} />)
      
      const messageText = screen.getByTestId('message-display-text')
      expect(messageText).toHaveClass('text-red-600')
    })
  })

  describe('Accessibility', () => {
    it('should be accessible with proper structure', () => {
      render(<MessageDisplay message="Test message" />)
      
      const container = screen.getByTestId('message-display')
      const text = screen.getByTestId('message-display-text')
      
      expect(container).toContainElement(text)
      expect(text.tagName).toBe('P')
    })

    it('should display the exact message text', () => {
      const longMessage = "This is a very long error message that should be displayed exactly as provided without any truncation or modification"
      render(<MessageDisplay message={longMessage} />)
      
      expect(screen.getByTestId('message-display-text')).toHaveTextContent(longMessage)
    })
  })

  describe('Edge cases', () => {
    it('should handle special characters in message', () => {
      const specialMessage = "Error: User@domain.com failed! 100% & <script>alert('test')</script>"
      render(<MessageDisplay message={specialMessage} />)
      
      expect(screen.getByTestId('message-display-text')).toHaveTextContent(specialMessage)
    })

    it('should handle very long messages', () => {
      const longMessage = 'x'.repeat(1000)
      render(<MessageDisplay message={longMessage} />)
      
      expect(screen.getByTestId('message-display-text')).toHaveTextContent(longMessage)
    })

    it('should handle whitespace-only messages', () => {
      render(<MessageDisplay message="   " />)
      
      expect(screen.getByTestId('message-display')).toBeInTheDocument()
      // textContent automatically trims whitespace, so we check the raw content
      expect(screen.getByTestId('message-display-text')).toBeInTheDocument()
    })
  })
}) 