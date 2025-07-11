import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { verifyOTP, resendOTP } from "@/lib/api/otp"

export interface UseOTPConfirmReturn {
  /** Array of 4 digits representing the OTP code */
  otp: string[]
  /** Whether resend operation is in progress */
  isResending: boolean
  /** Whether verification is in progress */
  isVerifying: boolean
  /** OTP method (email or phone) from previous step */
  otpMethod: "email" | "phone"
  /** Whether the OTP code is complete (4 digits) */
  isCodeComplete: boolean
  /** Function to handle OTP input changes */
  handleOTPChange: (otp: string[]) => void
  /** Function to handle code resend */
  handleResendCode: () => Promise<void>
  /** Function to handle OTP verification and submission */
  handleSubmit: (e: React.FormEvent) => Promise<void>
}

/**
 * Custom hook for managing OTP confirmation functionality
 * Handles state management, API calls, and navigation for the OTP confirm flow
 */
export const useOTPConfirm = (): UseOTPConfirmReturn => {
  const router = useRouter()
  const [otp, setOtp] = useState(["", "", "", ""])
  const [isResending, setIsResending] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [otpMethod, setOtpMethod] = useState<"email" | "phone">("email")

  useEffect(() => {
    // Get OTP method from localStorage
    const method = localStorage.getItem("otp_method") as "email" | "phone"

    if (method) {
      setOtpMethod(method)
    }
  }, [])

  const handleOTPChange = (newOtp: string[]) => {
    setOtp(newOtp)
  }

  const handleResendCode = async () => {
    setIsResending(true)
    try {
      const message = await resendOTP(otpMethod)
      // Show success toast notification
      toast.success(message, {
        duration: 4000,
        description: `New verification code sent to your ${otpMethod}`,
      })
      // Clear current OTP input
      setOtp(["", "", "", ""])
    } catch (error) {
      console.error("Failed to resend code:", error)
      toast.error("Failed to resend code. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const code = otp.join("")

    if (code.length !== 4) {
      return
    }

    setIsVerifying(true)
    try {
      // Get registration data from localStorage
      const registrationDataStr = localStorage.getItem("wynn_registration_data")
      let registrationData = {}
      
      if (registrationDataStr) {
        try {
          registrationData = JSON.parse(registrationDataStr)
        } catch (error) {
          console.error("Failed to parse registration data:", error)
        }
      }

      // Send registration request with OTP and registration data
      const message = await verifyOTP(code, otpMethod, registrationData)
      console.log("Registration completed successfully")
      
      // Show success toast
      toast.success(message, {
        duration: 4000,
        description: "Welcome to Wynn Resorts!",
      })
      
      // Clear localStorage
      localStorage.removeItem("otp_method")
      localStorage.removeItem("wynn_registration_data")
      
      // Clear the OTP input for potential future use
      setOtp(["", "", "", ""])
    } catch (error) {
      console.error("Failed to complete registration:", error)
      toast.error("Registration failed. Please try again.")
      // Clear the OTP to allow retry
      setOtp(["", "", "", ""])
    } finally {
      setIsVerifying(false)
    }
  }

  const isCodeComplete = otp.every(digit => digit !== "")

  return {
    otp,
    isResending,
    isVerifying,
    otpMethod,
    isCodeComplete,
    handleOTPChange,
    handleResendCode,
    handleSubmit,
  }
} 