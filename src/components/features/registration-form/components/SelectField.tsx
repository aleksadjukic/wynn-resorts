import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Control, Controller, FieldError } from "react-hook-form"
import { RegistrationFormData } from "@/lib/validations/registration"
import { cn } from "@/lib/utils"

interface Option {
  value: string
  label: string
}

interface SelectFieldProps {
  name: "gender" | "country"
  label: string
  placeholder: string
  options: readonly Option[]
  required?: boolean
  control: Control<RegistrationFormData>
  error?: FieldError
  className?: string
  tooltipContent?: string
}

const getDefaultTooltipContent = (name: "gender" | "country"): string => {
  switch (name) {
    case "gender":
      return "Select your gender identity for personalized service"
    case "country":
      return "Select your country of residence for compliance and service purposes"
    default:
      return "Please select an option"
  }
}

export const SelectField = ({
  name,
  label,
  placeholder,
  options,
  required = false,
  control,
  error,
  className = "w-full bg-white rounded-[4px]",
  tooltipContent
}: SelectFieldProps) => {
  const defaultTooltip = getDefaultTooltipContent(name)
  
  return (
    <div>
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="text-sm text-gray-700 mb-2 block">
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
      
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger 
              className={cn(
                className,
                error && "border-[#B3261E] focus:border-[#B3261E] focus:ring-[#B3261E] text-[#B3261E]"
              )} 
              id={name}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {error && (
        <p className="text-[#B3261E] text-sm mt-1">{error.message}</p>
      )}
    </div>
  )
} 