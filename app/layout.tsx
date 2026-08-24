import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "contexts/ThemeContext";

// TODO: Update icons (og-image.png, favicon.ico, apple-touch-icon.png)
// realfavicongenerator.net

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
        default: "Astro Dashboard",
        template: "%s | Astro Dashboard",
    },
    description: "A simple dashboard showing moon phase and sun data based on your location.",
    applicationName: "Astro Dashboard",
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        url: siteUrl,
        siteName: "Astro Dashboard",
        title: "Astro Dashboard",
        description: "Moon phase, moonrise/moonset and sun data for any location, in real time.",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Astro Dashboard — moon phase and sun data",
            },
        ],
        locale: "en_GB",
    },
    twitter: {
        card: "summary_large_image",
        title: "Astro Dashboard",
        description: "Moon phase, moonrise/moonset and sun data for any location, in real time.",
        images: ["/og-image.png"],
        creator: "@jake_russell123",
    },
    icons: {
        icon: "/favicon.ico",
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
                            name: "Astro Dashboard",
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
            </body>
        </html>
    );
}
