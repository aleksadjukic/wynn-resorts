"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { countries, type Country } from "@/lib/countries"
import Image from "next/image"

interface CountrySelectorProps {
    selectedCountry: Country
    onCountryChange: (country: Country) => void
}

export function CountrySelector({ selectedCountry, onCountryChange }: CountrySelectorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [dropdownPosition, setDropdownPosition] = useState<{
        top: number
        left: number
        width: number
        openUpward: boolean
    }>({ top: 0, left: 0, width: 0, openUpward: false })

    const buttonRef = useRef<HTMLButtonElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const filteredCountries = countries.filter(
        (country) =>
            country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            country.dialCode.includes(searchTerm) ||
            country.code.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const calculateDropdownPosition = () => {
        if (!buttonRef.current) return

        // Find the phone input container (parent of the flex container)
        const phoneInputContainer = buttonRef.current.closest('.space-y-2')
        const phoneInputField = phoneInputContainer?.querySelector('.flex.bg-white') as HTMLElement
        
        if (!phoneInputField) return

        const inputRect = phoneInputField.getBoundingClientRect()
        const viewportHeight = window.innerHeight
        const viewportWidth = window.innerWidth
        const dropdownHeight = 300 // Approximate height of dropdown
        const spacing = 8 // 8px spacing between input and dropdown

        // Check if dropdown should open upward
        const spaceBelow = viewportHeight - inputRect.bottom - spacing
        const spaceAbove = inputRect.top - spacing
        const openUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow

        // Use full width of the input
        const dropdownWidth = inputRect.width

        // Calculate horizontal position (align with input)
        let left = inputRect.left
        if (left + dropdownWidth > viewportWidth) {
            left = viewportWidth - dropdownWidth - 10 // 10px margin from edge
        }

        // Calculate vertical position with spacing
        const top = openUpward ? inputRect.top - dropdownHeight - spacing : inputRect.bottom + spacing

        setDropdownPosition({
            top: Math.max(10, top), // Ensure it's not too close to top edge
            left: Math.max(10, left), // Ensure it's not too close to left edge
            width: Math.min(dropdownWidth, viewportWidth - 20),
            openUpward,
        })
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false)
                setSearchTerm("")
            }
        }

        const handleScroll = () => {
            if (isOpen) {
                calculateDropdownPosition()
            }
        }

        const handleResize = () => {
            if (isOpen) {
                calculateDropdownPosition()
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
            window.addEventListener("scroll", handleScroll, true)
            window.addEventListener("resize", handleResize)
            calculateDropdownPosition()
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            window.removeEventListener("scroll", handleScroll, true)
            window.removeEventListener("resize", handleResize)
        }
    }, [isOpen])

    const handleCountrySelect = (country: Country) => {
        onCountryChange(country)
        setIsOpen(false)
        setSearchTerm("")
    }

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
    }

    return (
        <>
            <div className="relative">
                <button
                    ref={buttonRef}
                    type="button"
                    className="flex items-center gap-2 px-3 py-2 h-full hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                    onClick={toggleDropdown}
                >
                    <Image
                        src={selectedCountry.flag || "/placeholder.svg"}
                        alt={`${selectedCountry.name} flag`}
                        className="object-cover rounded-xs"
                        crossOrigin="anonymous"
                        width={28}
                        height={24}
                        objectFit="cover"
                    />
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>
            </div>

            {/* Portal-like dropdown using fixed positioning */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    className="fixed z-[9999] bg-white border border-gray-200 rounded-md shadow-lg"
                    style={{
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                        width: `${dropdownPosition.width}px`,
                    }}
                >
                    <div className="border-b border-gray-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search countries..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-9 border-0 rounded-none focus-visible:ring-0"
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                                <button
                                    key={country.code}
                                    type="button"
                                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors"
                                    onClick={() => handleCountrySelect(country)}
                                >
                                    <Image
                                        src={country.flag}
                                        alt={`${country.name} flag`}
                                        className="object-cover rounded-xs flex-shrink-0"
                                        crossOrigin="anonymous"
                                        width={28}
                                        height={20}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-gray-900 truncate">{country.name}</div>
                                    </div>
                                    <span className="text-sm text-gray-500 flex-shrink-0">{country.dialCode}</span>
                                </button>
                            ))
                        ) : (
                            <div className="px-3 py-2 text-sm text-gray-500 text-center">No countries found</div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
