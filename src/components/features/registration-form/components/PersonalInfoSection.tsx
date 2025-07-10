import { UseFormRegister, Control, FieldErrors } from "react-hook-form"
import { RegistrationFormData, genderOptions, countryOptions } from "@/lib/validations/registration"
import { FormField } from "./FormField"
import { SelectField } from "./SelectField"

interface PersonalInfoSectionProps {
  register: UseFormRegister<RegistrationFormData>
  control: Control<RegistrationFormData>
  errors: FieldErrors<RegistrationFormData>
}

export const PersonalInfoSection = ({ register, control, errors }: PersonalInfoSectionProps) => {
  return (
    <div>
      <h2 className="text-[22px] font-serif text-gray-900 mb-6 pb-2 border-b border-b-gray-400 inline-block pr-8">
        Personal Info
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <FormField
          id="firstName"
          label="First Name"
          placeholder="Enter first name..."
          required
          register={register}
          error={errors.firstName}
        />

        <FormField
          id="lastName"
          label="Last Name"
          placeholder="Enter last name..."
          required
          register={register}
          error={errors.lastName}
        />
      </div>

      <div className="flex flex-col gap-6">
        <SelectField
          name="gender"
          label="Gender"
          placeholder="Select gender..."
          options={genderOptions}
          required
          control={control}
          error={errors.gender}
        />

        <SelectField
          name="country"
          label="Your Residence Country"
          placeholder="Select your residence country..."
          options={countryOptions}
          required
          control={control}
          error={errors.country}
        />
      </div>
    </div>
  )
} 