"use client"

import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { registrationSchema, type RegistrationFormData } from "@/lib/validations/registration"

export const useRegistrationForm = () => {
  const router = useRouter()

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      acceptTerms: false
    }
  })

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = form

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      // Store user data for OTP sending
      localStorage.setItem("wynn_registration_data", JSON.stringify(data))

      // Navigate to OTP send page
      router.push("/otp-send")
    } catch (error) {
      console.error("Registration error:", error)
    }
  }

  return {
    register,
    handleSubmit: handleSubmit(onSubmit),
    control,
    errors,
    isSubmitting,
    onSubmit
  }
} 