import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { ThemeProvider } from "contexts/ThemeContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const siteUrl = "https://stargrade.co.uk";

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: {
        default: "Star Grade",
        template: "%s | Star Grade",
    },
    description: "A simple dashboard showing moon phase and sun data based on your location.",
    applicationName: "Star Grade",
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        url: siteUrl,
        siteName: "Star Grade",
        title: "Star Grade",
        description: "Moon phase, moonrise/moonset and sun data for any location, in real time.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Star Grade — moon phase and sun data",
            },
        ],
        locale: "en_GB",
    },
    twitter: {
        card: "summary_large_image",
        title: "Star Grade",
        description: "Moon phase, moonrise/moonset and sun data for any location, in real time.",
        images: ["/og-image.png"],
        creator: "@jake_russell123",
    },
    icons: {
        icon: [
            { url: "/favicon.svg", type: "image/svg+xml" },
            { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
            { url: "/favicon.ico" },
        ],
        apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#f8f9fb" },
        { media: "(prefers-color-scheme: dark)", color: "#0f0f23" },
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <script
                    type="application/ld+json"

                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebApplication",
                            name: "Star Grade",
                            url: siteUrl,
                            description:
                                "A dashboard showing moon phase, moonrise/moonset and sun data for any searched or geolocated location.",
                            applicationCategory: "UtilitiesApplication",
                            operatingSystem: "Any",
                            offers: {
                                "@type": "Offer",
                                price: "0",
                                priceCurrency: "GBP",
                            },
                        }),
                    }}
                />
                <ThemeProvider>{children}</ThemeProvider>
                <Analytics />
            </body>
        </html>
    );
}
