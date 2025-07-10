import Image from "next/image"

export interface FooterProps {
    className?: string
}

export default function Footer({ className }: FooterProps) {
    return (
        <footer className={`bg-[#5A3A27] text-white ${className || ''}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Shop Wynn Collection */}
                    <div>
                        <h3 className="text-sm font-medium mb-4 tracking-wide">Shop Wynn Collection</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:underline">
                                    Gift Cards
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Wynn Stores
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Wynn Store App
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Mobile App
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Responsible Gaming
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* About Us */}
                    <div>
                        <h3 className="text-sm font-medium mb-4 tracking-wide">About Us</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:underline">
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Investor Relations
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Privacy Notice
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Cookie Notice
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Terms of Use
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Hotel Information & Directory
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Wynn Palace Cotai */}
                    <div>
                        <h3 className="text-sm font-medium mb-4 tracking-wide">Wynn Palace Cotai</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="hover:underline">
                                    Encore Boston Harbor
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:underline">
                                    Wynn Macau
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Wynn and Encore Las Vegas */}
                    <div>
                        <h3 className="text-sm font-medium mb-4 tracking-wide">Wynn and Encore Las Vegas</h3>
                        <div className="text-sm space-y-1">
                            <p>3131 Las Vegas Blvd. Las Vegas, NV 89109</p>
                            <p>+1 (702) 770-7000</p>
                        </div>
                        <div className="mt-4">
                            <p className="text-xs mb-2">CONNECT WITH US</p>
                            <div className="flex" style={{ gap: '33px' }} role="list" aria-label="Social media links">
                                <a href="#" aria-label="Facebook" className="hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006F62] rounded" tabIndex={0}>
                                    <Image
                                        src="/icon-fb.svg"
                                        alt="Facebook"
                                        className="h-[27px] w-[27px]"
                                        width={27}
                                        height={27}
                                        loading="lazy"
                                    />
                                </a>
                                <a href="#" aria-label="Androind" className="hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006F62] rounded" tabIndex={0}>
                                    <Image
                                        src="/icon-android.svg"
                                        alt="Androind"
                                        className="h-[27px] w-[27px]"
                                        width={27}
                                        height={27}
                                        loading="lazy"
                                    />
                                </a>
                                <a href="#" aria-label="Apple" className="hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006F62] rounded" tabIndex={0}>
                                    <Image
                                        src="/icon-apple.svg"
                                        alt="Apple"
                                        className="h-[27px] w-[27px]"
                                        width={27}
                                        height={27}
                                        loading="lazy"
                                    />
                                </a>

                                <a href="#" aria-label="Instagram" className="hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006F62] rounded" tabIndex={0}>
                                    <Image
                                        src="/icon-ig.svg"
                                        alt="Instagram"
                                        className="h-[27px] w-[27px]"
                                        width={27}
                                        height={27}
                                        loading="lazy"
                                    />
                                </a>
                                <a href="#" aria-label="X social network logo" className="hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#006F62] rounded" tabIndex={0}>
                                    <Image
                                        src="/icon-x.svg"
                                        alt="X"
                                        className="h-[27px] w-[27px]"
                                        width={27}
                                        height={27}
                                        loading="lazy"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 text-center">
                    <div className="text-sm space-y-1">
                        <p>Do Not Sell Or Share My Data</p>
                        <p>© 2024 Wynn Resorts Holdings, LLC. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
} 