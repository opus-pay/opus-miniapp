import type { ReactNode } from "react";

import "./globals.css";

export const metadata = {
    title: "OPUS mini-app kit",
    description: "Every part of the OPUS mini-app kit on one page.",
};

export const viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
