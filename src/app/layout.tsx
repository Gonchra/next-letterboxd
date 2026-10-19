import type {Metadata} from "next";
import {Golos_Text, Geist } from "next/font/google";
import "./globals.css";
import {ReactNode} from "react";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const font = Golos_Text({
    variable: "--font-golos",
    subsets: ["latin", 'cyrillic'],
});


export const metadata: Metadata = {
    title: {
        default: "Letterboxd - Сообщество любителей кино",
        template: "%s - Letterboxd"
    },
    description: "Отмечай просмотренные фильмы, сохраняй списки и делись впечатлениями о кино с единомышленниками",
    openGraph: {
        type: 'website',
        siteName: 'Letterboxd',
    },
    twitter: {
        card: 'summary_large_image'
    },
    metadataBase: new URL('https://letterboxd.com')
};

export default function RootLayout({children}: Readonly<{ children: ReactNode }>) {
    return (
        <html
            lang="en"
            className={cn("h-full", "antialiased", font.variable, "font-sans", geist.variable)}
            suppressHydrationWarning
        >
        <body>{children}</body>
        </html>
    );
}
