import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Header() {
    return (
        <header className="bg-white border-b h-[125px] flex items-center">
            <div className="mx-auto px-4 sm:px-6 lg:px-[60px] w-full">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Image src="/wynn-logo.svg" alt="Wynn Resorts" width={161} height={77} />
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-8 text-[14px]" aria-label="Main navigation">
                        <a href="#" className="font-medium text-foreground hover:text-gray-900 tracking-wide">
                            ROOMS & SUITES
                        </a>
                        <a href="#" className="font-medium text-foreground hover:text-gray-900 tracking-wide">
                            WYNN REWARDS
                        </a>
                        <a href="#" className="font-medium text-foreground hover:text-gray-900 tracking-wide">
                            OFFERS
                        </a>
                        <a href="#" className="font-medium text-foreground hover:text-gray-900 tracking-wide">
                            DINING
                        </a>
                        <a href="#" className="font-medium text-foreground hover:text-gray-900 tracking-wide">
                            ENTERTAINMENT
                        </a>
                        <a href="#" className="font-medium text-foreground hover:text-gray-900 tracking-wide">
                            MEETINGS & EVENTS
                        </a>
                    </nav>

                    {/* Language Selector */}
                    <div className="flex items-center">
                        <Select defaultValue="en" aria-label="Select language">
                            <SelectTrigger className="w-20 border-none shadow-none text-[17px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">EN</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </header>
    )
} 