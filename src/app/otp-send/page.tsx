"use client"

import { Button } from "@/components/ui/button"
import Header from "@/components/layout/Header/Header"
import Footer from "@/components/layout/Footer/Footer"
import Link from "next/link"
import { useOTPSend } from "@/components/features/otp-send/hooks/useOTPSend"
import { OTPMethodSelector } from "@/components/features/otp-send/components/OTPMethodSelector"
import { MessageDisplay } from "@/components/features/otp-send/components/MessageDisplay"

export default function OTPSendPage() {
    const {
        selectedMethod,
        isLoading,
        message,
        handleMethodChange,
        handleNext,
    } = useOTPSend();

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Main Content */}
            <main className="max-w-2xl mx-auto py-[60px] px-4 sm:px-6 lg:px-8">
                <div className="rounded-lg">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-[37px] font-serif text-[#1D1F22]">Registration</h1>
                            <span className="font-serif text-2xl text-[#1D1F22]">Step 2 of 3</span>
                        </div>
                        <p className="text-[15.5px] text-[#1D1F22] font-semibold">Please select how you'd like to receive your verification code.</p>
                    </div>

                    {/* OTP Method Selection */}
                    <OTPMethodSelector
                        selectedMethod={selectedMethod}
                        onMethodChange={handleMethodChange}
                        isLoading={isLoading}
                    />

                    {/* Message Display */}
                    <MessageDisplay message={message} type="error" />

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-10 w-full">
                        <Button
                            variant="outline"
                            className="text-[16px] border-gray-300 py-[16px] px-[32px] h-[56px] flex-1 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                            asChild
                        >
                            <Link href="/">Back</Link>
                        </Button>
                        <Button
                            className="text-[16px] bg-[#006F62] py-[16px] px-[32px] h-[56px] flex-1 hover:bg-[#005951] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#006F62] transition-colors"
                            disabled={!selectedMethod || isLoading}
                            onClick={handleNext}
                        >
                            {isLoading ? "Sending..." : "Next"}
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
} 