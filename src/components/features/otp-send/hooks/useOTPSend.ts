import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { sendOTPEmail, sendOTPPhone } from "@/lib/api/otp"
import { OTPMethod } from "../components/OTPMethodSelector"

interface RegistrationData {
  email?: string
  phone?: string
  [key: string]: any
}

export interface UseOTPSendReturn {
  /** Currently selected OTP method */
  selectedMethod: OTPMethod
  /** Whether OTP sending is in progress */
  isLoading: boolean
  /** Current message to display */
  message: string
  /** Function to handle method selection change */
  handleMethodChange: (method: OTPMethod) => void
  /** Function to send OTP and navigate to next page */
  handleNext: () => Promise<void>
}

/**
 * Custom hook for managing OTP send functionality
 * Handles state management, API calls, and navigation for the OTP send flow
 */
export const useOTPSend = (): UseOTPSendReturn => {
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState<OTPMethod>("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userPhone, setUserPhone] = useState("")

  useEffect(() => {
    // Get user data from localStorage (set from registration form)
    const registrationData = localStorage.getItem("wynn_registration_data")
    if (registrationData) {
      try {
        const data: RegistrationData = JSON.parse(registrationData)
        setUserEmail(data.email || "")
        setUserPhone(data.phone || "")
      } catch (error) {
        console.error("Failed to parse registration data:", error)
      }
    }
  }, [])

  const handleMethodChange = (method: OTPMethod) => {
    setSelectedMethod(method)
    setMessage("")
  }

  const handleNext = async () => {
    if (!selectedMethod) {
      setMessage("Please select a method first")
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      let responseMessage = ""

      if (selectedMethod === "email") {
        responseMessage = await sendOTPEmail(userEmail)
      } else if (selectedMethod === "phone") {
        responseMessage = await sendOTPPhone(userPhone)
      }

      // Store only the method for the next page
      localStorage.setItem("otp_method", selectedMethod)

      // Show success toast notification
      toast.success(responseMessage, {
        duration: 4000,
        description: `Verification code sent to your ${selectedMethod}`,
      })

      // Navigate to OTP confirm page
      router.push("/otp-confirm")
    } catch (error) {
      console.error("Failed to send OTP:", error)
      setMessage("Failed to send OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return {
    selectedMethod,
    isLoading,
    message,
    handleMethodChange,
    handleNext,
  }
} 