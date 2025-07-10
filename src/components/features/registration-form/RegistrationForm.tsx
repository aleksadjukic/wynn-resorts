"use client"

import { useRegistrationForm } from "./hooks/useRegistrationForm"
import { PersonalInfoSection } from "./components/PersonalInfoSection"
import { ContactDetailsSection } from "./components/ContactDetailsSection"
import { TermsSection } from "./components/TermsSection"

const RegistrationForm = () => {
    const { register, handleSubmit, control, errors, isSubmitting,  } = useRegistrationForm()

    return (
        <div className="max-w-2xl mx-auto py-[60px] px-4 sm:px-6 lg:px-8">
            <div className="rounded-lg">
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-[37px] font-serif text-[#1D1F22]">Registration</h1>
                        <span className="font-serif text-2xl text-[#1D1F22]">Step 1 of 3</span>
                    </div>
                    <p className="text-[15.5px] text-[#1D1F22] font-semibold">
                        Please enter below information to create your account.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <PersonalInfoSection 
                        register={register}
                        control={control}
                        errors={errors}
                    />

                    <ContactDetailsSection 
                        register={register}
                        control={control}
                        errors={errors}
                    />
                </form>

                <TermsSection 
                    control={control}
                    errors={errors}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit}
                />
            </div>
        </div>
    )
}

export default RegistrationForm 