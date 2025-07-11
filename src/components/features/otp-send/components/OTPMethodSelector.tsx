import { Label } from "@/components/ui/label"

export type OTPMethod = "email" | "phone" | ""

interface OTPMethodSelectorProps {
  /** Currently selected OTP method */
  selectedMethod: OTPMethod
  /** Callback when method selection changes */
  onMethodChange: (method: OTPMethod) => void
  /** Whether the component is in loading state */
  isLoading?: boolean
  /** Test ID for the component */
  'data-testid'?: string
}

/**
 * OTPMethodSelector component for choosing between email and phone OTP delivery
 * Used in the OTP send flow to allow users to select their preferred method
 */
export const OTPMethodSelector = ({
  selectedMethod,
  onMethodChange,
  isLoading = false,
  'data-testid': testId = 'otp-method-selector'
}: OTPMethodSelectorProps) => {
  const handleMethodChange = (value: string) => {
    onMethodChange(value as OTPMethod)
  }

  return (
    <div className="mb-8" data-testid={testId}>
      <h2 className="text-[22px] font-serif text-gray-900 mb-6 pb-2 border-b border-b-gray-400 inline-block pr-8">
        OTP Verification
      </h2>

      <div className="text-center mb-8">
        <div className="mx-auto bg-white p-6">
          <h3 className="text-[18px] text-[#1D1F22] mb-6 font-serif">Send OTP</h3>
          <p className="text-[18px] text-[#1D1F22] mb-6">
            How would you like to receive the code?
          </p>

          <div className="space-y-4 flex justify-center gap-8" data-testid={`${testId}-options`}>
            <div className="flex items-center space-x-3 mb-0">
              <input
                type="radio"
                id="phone"
                name="otpMethod"
                value="phone"
                checked={selectedMethod === "phone"}
                onChange={(e) => handleMethodChange(e.target.value)}
                disabled={isLoading}
                className="h-4 w-4 text-[#006F62] border-gray-300 focus:ring-[#006F62]"
                data-testid={`${testId}-phone-radio`}
              />
              <Label htmlFor="phone" className="text-[16px] text-[#1D1F22] cursor-pointer">
                Send to Phone
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="email"
                name="otpMethod"
                value="email"
                checked={selectedMethod === "email"}
                onChange={(e) => handleMethodChange(e.target.value)}
                disabled={isLoading}
                className="h-4 w-4 text-[#006F62] border-gray-300 focus:ring-[#006F62]"
                data-testid={`${testId}-email-radio`}
              />
              <Label htmlFor="email" className="text-[16px] text-[#1D1F22] cursor-pointer">
                Send to Email
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 