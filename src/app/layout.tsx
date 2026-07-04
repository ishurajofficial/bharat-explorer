import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/providers/auth-provider';

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bharat Explorer - Interactive India Travel Map",
  description: "Track your journey across every State and Union Territory of India with a beautiful interactive map dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="bottom-right" toastOptions={{
          style: {
            background: 'var(--glass)',
            color: 'var(--foreground)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--glass-border)',
          }
        }} />
      </body>
    </html>
  );
}
