export interface OTPResponse {
  msg?: string
  success?: boolean
}

export interface SendOTPEmailRequest {
  email: string
}

export interface SendOTPPhoneRequest {
  phone: string
}

/**
 * Sends OTP via email
 * @param email - User's email address
 * @returns Promise with the API response
 */
export const sendOTPEmail = async (email: string): Promise<string> => {
  const response = await fetch("https://demo4687464.mockable.io/send-otp-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result: OTPResponse = await response.json()
  console.log("Email OTP response:", result)
  return result.msg || "OTP sent successfully to your email"
}

/**
 * Sends OTP via phone
 * @param phone - User's phone number
 * @returns Promise with the API response
 */
export const sendOTPPhone = async (phone: string): Promise<string> => {
  const response = await fetch("http://demo4687464.mockable.io/send-otp-phone", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ phone }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result: OTPResponse = await response.json()
  console.log("Phone OTP response:", result)
  return result.msg || "OTP sent successfully to your phone"
}

export interface VerifyOTPRequest {
  code: string
  method: "email" | "phone"
  registrationData?: any
}

export interface ResendOTPRequest {
  method: "email" | "phone"
}

export interface RegisterRequest {
  code: string
  method: "email" | "phone"
  [key: string]: any // Allow additional registration data
}

/**
 * Completes user registration with OTP verification
 * @param code - The 4-digit OTP code
 * @param method - The method used to receive OTP (email or phone)
 * @param registrationData - The user's registration data
 * @returns Promise with the registration response
 */
export const verifyOTP = async (code: string, method: "email" | "phone", registrationData?: any): Promise<string> => {
  // Prepare the request payload with OTP and registration data
  const payload: RegisterRequest = {
    code,
    method,
    ...registrationData
  }

  const response = await fetch("http://demo4687464.mockable.io/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result: OTPResponse = await response.json()
  console.log("Registration response:", result)
  return result.msg || "Registration completed successfully"
}

/**
 * Resends OTP using the previously selected method
 * @param method - The method to resend OTP (email or phone)
 * @returns Promise with the resend response
 */
export const resendOTP = async (method: "email" | "phone"): Promise<string> => {
  const response = await fetch("https://demo4687464.mockable.io/resend-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ method }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result: OTPResponse = await response.json()
  console.log("Resend OTP response:", result)
  return result.msg || `OTP resent successfully to your ${method}`
} 