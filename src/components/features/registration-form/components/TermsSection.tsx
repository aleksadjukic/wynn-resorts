import { Control, FieldErrors } from "react-hook-form"
import { RegistrationFormData } from "@/lib/validations/registration"
import { Button } from "@/components/ui/button"
import { CheckboxField } from "./CheckboxField"

interface TermsSectionProps {
  control: Control<RegistrationFormData>
  errors: FieldErrors<RegistrationFormData>
  isSubmitting: boolean
  onSubmit: () => void
}

export const TermsSection = ({ control, errors, isSubmitting, onSubmit }: TermsSectionProps) => {
  return (
    <div className="mt-8">
      <CheckboxField
        name="acceptTerms"
        label="I agree to the terms and conditions and privacy policy."
        control={control}
        error={errors.acceptTerms}
      />

      <Button
        type="submit"
        disabled={isSubmitting}
        className="text-[16px] bg-[#006F62] py-[16px] px-[32px] h-[56px] w-[217px] mt-10 disabled:opacity-50"
        onClick={onSubmit}
      >
        {isSubmitting ? "Processing..." : "Next"}
      </Button>
    </div>
  )
} 