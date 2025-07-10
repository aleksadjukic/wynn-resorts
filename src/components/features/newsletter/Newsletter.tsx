"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function Newsletter() {
    const [email, setEmail] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) return

        setIsSubmitting(true)
        try {
            // Make request to the newsletter API
            const response = await fetch('http://demo4687464.mockable.io/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            })

            const data = await response.json()

            if (response.ok) {
                // Show success message from API response
                toast.success(data.msg || 'Successfully subscribed to newsletter!')
                setEmail("")
            } else {
                // Show error message from API response
                toast.error(data.msg || 'Failed to subscribe to newsletter')
            }
        } catch (error) {
            console.error("Newsletter signup error:", error)
            toast.error('Network error. Please try again later.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section
            className="w-full bg-white flex flex-col lg:flex-row lg:items-stretch items-start gap-4 lg:gap-0 px-4 sm:px-6 md:px-8 lg:px-[70px] py-6 lg:py-8"
            aria-label="Newsletter section"
        >
            {/* Title Section */}
            <div className="flex items-center justify-start w-full lg:flex-[1_1_0%]">
                <span className="block font-serif text-lg sm:text-xl md:text-[21px] text-gray-900 font-medium">
                    Get News &amp; Updates
                </span>
            </div>

            {/* Description Section */}
            <div className="flex items-center justify-start lg:justify-center w-full lg:flex-[1_1_0%]">
                <span className="block text-sm sm:text-base text-[#565759] leading-relaxed">
                    Get latest developments and exciting news on how we are shaping the future!
                </span>
            </div>

            {/* Form Section */}
            <form
                className="flex items-center justify-start lg:justify-end w-full lg:flex-[2_1_0%] lg:min-w-[260px]"
                onSubmit={handleSubmit}
                aria-label="Newsletter signup"
            >
                <div className="relative w-full max-w-lg lg:max-w-none">
                    <input
                        type="email"
                        required
                        aria-label="Your email address"
                        placeholder="Your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-12 sm:h-14 lg:h-[72px] rounded-sm border border-gray-300 pr-4 sm:pr-32 lg:pr-56 pl-3 sm:pl-4 lg:pl-5 py-2 lg:py-3 text-sm sm:text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#006F62] focus:border-[#006F62] transition-all duration-200 relative z-0"
                        autoComplete="email"
                        disabled={isSubmitting}
                    />
                    <Button
                        type="submit"
                        variant="outline"
                        className="absolute top-1/2 right-1 sm:right-2 lg:right-3 -translate-y-1/2 h-8 sm:h-10 lg:h-11 px-3 sm:px-6 lg:px-8 bg-white border-[2px] border-[#006F62] text-[#006F62] font-semibold cursor-pointer transition-all duration-200 z-50 text-xs sm:text-sm lg:text-base hover:bg-[#006F62] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Join The Newsletter"
                        disabled={isSubmitting}
                    >
                        <span className="hidden sm:inline">
                            {isSubmitting ? "Joining..." : "Join The Newsletter"}
                        </span>
                        <span className="inline sm:hidden">
                            {isSubmitting ? "..." : "Join"}
                        </span>
                    </Button>
                </div>
            </form>
        </section>
    )
} 