import { z } from "zod"

export const registrationSchema = z.object({
  firstName: z.string().min(1, "First name is required").min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(1, "Last name is required").min(2, "Last name must be at least 2 characters"),
  gender: z.enum(["male", "female", "other"], {
    message: "Please select a gender",
  }),
  country: z.string().min(1, "Please select your residence country"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required").min(10, "Phone number must be at least 10 digits"),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions to continue",
  }),
})

export type RegistrationFormData = z.infer<typeof registrationSchema>

export const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
] as const

export const countryOptions = [
  { value: "us", label: "United States" },
  { value: "ae", label: "United Arab Emirates" },
  { value: "uk", label: "United Kingdom" },
] as const 