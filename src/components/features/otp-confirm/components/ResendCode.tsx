interface ResendCodeProps {
  /** Whether the resend operation is in progress */
  isResending: boolean
  /** Callback when resend is clicked */
  onResend: () => void
  /** Test ID for the component */
  'data-testid'?: string
}

/**
 * ResendCode component for handling OTP resend functionality
 * Shows a resend button or loading state based on the isResending prop
 */
export const ResendCode = ({ 
  isResending, 
  onResend, 
  'data-testid': testId = 'resend-code' 
}: ResendCodeProps) => {
  return (
    <div className="text-center" data-testid={testId}>
      <p className="text-sm text-gray-500 mb-4">
        Didn't get a code?
      </p>
      {isResending ? (
        <p 
          className="text-sm text-gray-500"
          data-testid={`${testId}-loading`}
        >
          Sending code...
        </p>
      ) : (
        <button
          type="button"
          onClick={onResend}
          className="text-sm text-[#006F62] hover:underline"
          data-testid={`${testId}-button`}
        >
          Resend code
        </button>
      )}
    </div>
  )
} 