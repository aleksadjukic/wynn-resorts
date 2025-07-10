import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { UseFormRegister, FieldError } from "react-hook-form"
import { RegistrationFormData } from "@/lib/validations/registration"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  id: keyof RegistrationFormData
  label: string
  placeholder: string
  type?: string
  required?: boolean
  register: UseFormRegister<RegistrationFormData>
  error?: FieldError
  className?: string
  tooltipContent?: string
}

const getDefaultTooltipContent = (id: keyof RegistrationFormData): string => {
  switch (id) {
    case "firstName":
      return "Enter your legal first name as it appears on your ID"
    case "lastName":
      return "Enter your legal last name as it appears on your ID"
    case "email":
      return "We'll use this email for account verification and communications"
    default:
      return "Please provide accurate information"
  }
}

export const FormField = ({
  id,
  label,
  placeholder,
  type = "text",
  required = false,
  register,
  error,
  className = "w-full h-[60px] bg-white rounded-[4px]",
  tooltipContent
}: FormFieldProps) => {
  const defaultTooltip = getDefaultTooltipContent(id)
  
  return (
    <div>
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm text-gray-700 mb-2 block">
          {label} {required && <span aria-label="required">*</span>}
        </Label>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 text-gray-400 hover:text-gray-600 mb-2"
                type="button"
              >
                <Info className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{tooltipContent || defaultTooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        className={cn(
          className,
          error && "border-[#B3261E] focus:border-[#B3261E] focus:ring-[#B3261E] text-[#B3261E]"
        )}
        {...register(id)}
      />
      {error && (
        <p className="text-[#B3261E] text-sm mt-1">{error.message}</p>
      )}
    </div>
  )
} 