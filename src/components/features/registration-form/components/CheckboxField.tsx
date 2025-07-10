import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Control, Controller, FieldError } from "react-hook-form"
import { RegistrationFormData } from "@/lib/validations/registration"
import { cn } from "@/lib/utils"

interface CheckboxFieldProps {
  name: "acceptTerms"
  label: string
  control: Control<RegistrationFormData>
  error?: FieldError
  className?: string
  tooltipContent?: string
}

const getDefaultTooltipContent = (name: "acceptTerms"): string => {
  switch (name) {
    case "acceptTerms":
      return "By checking this box, you agree to our Terms of Service and Privacy Policy. This is required to create your account."
    default:
      return "Please review and accept to continue"
  }
}

export const CheckboxField = ({
  name,
  label,
  control,
  error,
  className = "flex items-center gap-3",
  tooltipContent
}: CheckboxFieldProps) => {
  const defaultTooltip = getDefaultTooltipContent(name)
  
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className={className}>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Checkbox
                id={name}
                checked={field.value}
                onCheckedChange={field.onChange}
                className={cn(
                  error && "border-[#B3261E] data-[state=checked]:border-[#B3261E]"
                )}
              />
            )}
          />
          <Label 
            htmlFor={name} 
            className="text-[16px] text-[#1D1F22] leading-relaxed"
          >
            {label}
          </Label>
        </div>
      </div>
      
      {error && (
        <p className="text-[#B3261E] text-sm mt-1">{error.message}</p>
      )}
    </div>
  )
} 