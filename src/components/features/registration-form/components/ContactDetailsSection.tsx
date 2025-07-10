import { UseFormRegister, Control, FieldErrors, Controller } from "react-hook-form"
import { RegistrationFormData } from "@/lib/validations/registration"
import { FormField } from "./FormField"
import PhoneNumberInput from "@/components/features/phone-input/PhoneNumberInput"

interface ContactDetailsSectionProps {
  register: UseFormRegister<RegistrationFormData>
  control: Control<RegistrationFormData>
  errors: FieldErrors<RegistrationFormData>
}

export const ContactDetailsSection = ({ register, control, errors }: ContactDetailsSectionProps) => {
  return (
    <div>
      <h2 className="text-lg font-serif text-gray-900 mb-6 pb-2 border-b border-b-gray-400 inline-block pr-8">
        Contact Details
      </h2>

      <div className="space-y-6">
        <FormField
          id="email"
          label="Email"
          placeholder="anton@gmail.com"
          type="email"
          required
          register={register}
          error={errors.email}
        />

        <div>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneNumberInput
                value={field.value}
                onChange={field.onChange}
                error={errors.phone?.message}
                label="Phone Number"
                required
              />
            )}
          />
        </div>
      </div>
    </div>
  )
} 