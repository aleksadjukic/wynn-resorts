interface MessageDisplayProps {
  /** The message to display */
  message: string
  /** The type of message - determines styling */
  type?: 'error' | 'success' | 'info'
  /** Test ID for the message container */
  'data-testid'?: string
}

/**
 * MessageDisplay component for showing error, success, and info messages
 * Used in the OTP flow to display API responses and validation messages
 */
export const MessageDisplay = ({ 
  message, 
  type = 'error', 
  'data-testid': testId = 'message-display' 
}: MessageDisplayProps) => {
  if (!message) return null

  const getMessageStyles = () => {
    switch (type) {
      case 'error':
        return 'text-red-600'
      case 'success':
        return 'text-green-600'
      case 'info':
        return 'text-blue-600'
      default:
        return 'text-red-600'
    }
  }

  return (
    <div className="text-center mt-4" data-testid={testId}>
      <p className={`text-sm ${getMessageStyles()}`} data-testid={`${testId}-text`}>
        {message}
      </p>
    </div>
  )
} 