"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CountrySelector } from "@/components/features/country-selector/CountrySelector"
import { countries, type Country } from "@/lib/countries"
import { cn } from "@/lib/utils"

interface PhoneNumberInputProps {
  value?: string
  onChange?: (value: string) => void
  onCountryChange?: (country: Country) => void
  error?: string
  placeholder?: string
  className?: string
  label?: string
  required?: boolean
}

export default function PhoneNumberInput({
  value = "",
  onChange,
  onCountryChange,
  error,
  placeholder,
  className = "",
  label = "Phone Number",
  required = false
}: PhoneNumberInputProps) {
  const [phoneNumber, setPhoneNumber] = useState(value)
  const [selectedCountry, setSelectedCountry] = useState<Country>(
    countries.find((c) => c.code === "AE") || countries[0],
  )

  // Update internal state when external value changes
  useEffect(() => {
    setPhoneNumber(value)
  }, [value])

  const formatPhoneNumber = (value: string, countryCode: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "")

    // Different formatting based on country
    if (countryCode === "+1") {
      // US/Canada format: (XXX) XXX-XXXX
      if (digits.length <= 3) {
        return digits
      } else if (digits.length <= 6) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
      } else {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`
      }
    } else if (countryCode === "+44") {
      // UK format: XXXX XXX XXXX
      if (digits.length <= 4) {
        return digits
      } else if (digits.length <= 7) {
        return `${digits.slice(0, 4)} ${digits.slice(4)}`
      } else {
        return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`
      }
    } else if (countryCode === "+971") {
      // UAE format: (XXX) - XXXX
      if (digits.length <= 3) {
        return digits
      } else if (digits.length <= 7) {
        return `(${digits.slice(0, 3)}) - ${digits.slice(3)}`
      } else {
        return `(${digits.slice(0, 3)}) - ${digits.slice(3, 7)}`
      }
    } else {
      // Generic format: XXX XXX XXXX
      if (digits.length <= 3) {
        return digits
      } else if (digits.length <= 6) {
        return `${digits.slice(0, 3)} ${digits.slice(3)}`
      } else {
        return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`
      }
    }
  }

  const getPlaceholder = (countryCode: string) => {
    if (placeholder) return placeholder
    
    switch (countryCode) {
      case "+1":
        return "(XXX) XXX-XXXX"
      case "+44":
        return "XXXX XXX XXXX"
      case "+971":
        return "( ___ ) - ____"
      default:
        return "XXX XXX XXXX"
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value, selectedCountry.dialCode)
    setPhoneNumber(formatted)
    onChange?.(formatted)
  }

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country)
    onCountryChange?.(country)
    // Clear phone number when country changes
    setPhoneNumber("")
    onChange?.("")
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
                     {label && (
             <Label htmlFor="phone" className="text-sm text-gray-700 mb-2 block">
               {label} {required && <span>*</span>}
             </Label>
           )}
          
                     {/* Info Icon - moved outside to top right */}
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
                 <p className="max-w-xs">Phone number format will adjust based on selected country</p>
               </TooltipContent>
             </Tooltip>
           </TooltipProvider> 
        </div>

                 <div className={cn(
           "flex bg-white border border-gray-200 rounded-[4px] overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500",
           error && "border-[#B3261E] focus-within:border-[#B3261E] focus-within:ring-[#B3261E]"
         )}>
          {/* Country Selector */}
          <div className="flex items-center bg-white">
            <CountrySelector 
              selectedCountry={selectedCountry} 
              onCountryChange={handleCountryChange} 
            />
          </div>

          {/* Country Code Display - removed right border */}
          <div className="flex items-center text-sm text-gray-600 min-w-0 pr-1">
            <span className="truncate">{selectedCountry.dialCode}</span>
          </div>

          {/* Phone Number Input */}
          <Input
            id="phone"
            type="text"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder={getPlaceholder(selectedCountry.dialCode)}
                         className={cn(
               "flex-1 pl-1 border-0 bg-white focus:ring-0 focus:border-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 h-[60px] rounded-l-none border-l-0",
               error && "text-[#B3261E]"
             )}
            maxLength={20}
          />
        </div>

               {error && (
         <p className="text-[#B3261E] text-sm mt-1">{error}</p>
       )}
      </div>
    </div>
  )
}
