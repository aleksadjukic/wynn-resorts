interface SuccessMessageProps {
  /** The success message to display */
  message: string
  /** Test ID for the component */
  'data-testid'?: string
}

/**
 * SuccessMessage component for displaying OTP confirmation messages
 * Shows a green success box with the provided message
 */
export const SuccessMessage = ({ 
  message, 
  'data-testid': testId = 'success-message' 
}: SuccessMessageProps) => {
  if (!message) return null

  return (
    <div 
      className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6" 
      data-testid={testId}
    >
      <p 
        className="text-[16px] text-[#006F62] font-medium"
        data-testid={`${testId}-text`}
      >
        {message}
      </p>
    </div>
  )
} 