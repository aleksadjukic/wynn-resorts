"use client"

import { Button } from "@/components/ui/button"
import Header from "@/components/layout/Header/Header"
import Footer from "@/components/layout/Footer/Footer"
import Link from "next/link"
import { useOTPConfirm } from "@/components/features/otp-confirm/hooks/useOTPConfirm"
import { OTPInput } from "@/components/features/otp-confirm/components/OTPInput"
import { ResendCode } from "@/components/features/otp-confirm/components/ResendCode"

export default function OTPConfirmPage() {
    const {
        otp,
        isResending,
        isVerifying,
        otpMethod,
        isCodeComplete,
        handleOTPChange,
        handleResendCode,
        handleSubmit,
    } = useOTPConfirm()

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
                            <span className="font-serif text-2xl text-[#1D1F22]">Step 3 of 3</span>
                        </div>
                        <p className="text-[15.5px] text-[#1D1F22] font-semibold">Please enter the verification code to complete your registration.</p>
                    </div>

                    {/* OTP Confirmation Section */}
                    <div className="mb-8">
                        <h2 className="text-[22px] font-serif text-gray-900 mb-6 pb-2 border-b border-b-gray-400 inline-block pr-8">
                            Please check your {otpMethod}
                        </h2>

                        <div className="text-center mb-8">
                            <p className="text-[16px] text-gray-600 mb-6">
                                Please enter the 4-digit code we just sent to your {otpMethod}
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* OTP Input Fields */}
                                <OTPInput
                                    value={otp}
                                    onChange={handleOTPChange}
                                    disabled={isVerifying}
                                />

                                {/* Resend Code */}
                                <ResendCode
                                    isResending={isResending}
                                    onResend={handleResendCode}
                                />
                            </form>
                        </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-10 w-full">
                        <Button
                            variant="outline"
                            className="text-[16px] border-gray-300 flex-1 py-[16px] px-[32px] h-[56px] w-[217px] hover:bg-gray-50 hover:border-gray-400 transition-colors"
                            asChild
                        >
                            <Link href="/otp-send">Back</Link>
                        </Button>
                        <Button
                            className="text-[16px] bg-[#006F62] flex-1 py-[16px] px-[32px] h-[56px] w-[217px] hover:bg-[#005951] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#006F62] transition-colors"
                            onClick={handleSubmit}
                            disabled={!isCodeComplete || isVerifying}
                        >
                            {isVerifying ? "Verifying..." : "Next"}
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
} 