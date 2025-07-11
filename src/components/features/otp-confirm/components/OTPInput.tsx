import { useRef, useEffect } from "react"

interface OTPInputProps {
  /** Array of 4 digits representing the OTP code */
  value: string[]
  /** Callback when OTP value changes */
  onChange: (otp: string[]) => void
  /** Whether the input is disabled */
  disabled?: boolean
  /** Test ID for the component */
  'data-testid'?: string
}

/**
 * OTPInput component for entering 4-digit verification codes
 * Features auto-focus, paste handling, and keyboard navigation
 */
export const OTPInput = ({ 
  value, 
  onChange, 
  disabled = false, 
  'data-testid': testId = 'otp-input' 
}: OTPInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0] && !disabled) {
      inputRefs.current[0].focus()
    }
  }, [disabled])

  const handleInputChange = (index: number, inputValue: string) => {
    // Only allow single digit
    if (inputValue.length > 1) return

    const newOtp = [...value]
    newOtp[index] = inputValue

    onChange(newOtp)

    // Auto-focus next input if value entered
    if (inputValue && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 4)
    const newOtp = ["", "", "", ""]

    for (let i = 0; i < pastedData.length; i++) {
      if (/\d/.test(pastedData[i])) {
        newOtp[i] = pastedData[i]
      }
    }

    onChange(newOtp)

    // Focus the next empty input or last input
    const nextIndex = Math.min(pastedData.length, 3)
    inputRefs.current[nextIndex]?.focus()
  }

  return (
    <div className="flex justify-center gap-4 mb-6" data-testid={testId}>
      {value.map((digit, index) => (
        <input
          key={index}
          ref={el => { inputRefs.current[index] = el }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]"
          maxLength={1}
          value={digit}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : undefined}
          disabled={disabled}
          className="w-16 h-16 text-2xl text-center border-2 border-gray-300 rounded-lg focus:border-[#006F62] focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          aria-label={`Digit ${index + 1}`}
          data-testid={`${testId}-${index}`}
        />
      ))}
    </div>
  )
} 