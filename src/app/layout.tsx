"use client";

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/protected-route'
import { AmplifyProvider } from '@/components/amplify-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Data Privacy App',
  description: 'A simple app to manage your data privacy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AmplifyProvider>
          <AuthProvider>
            <ProtectedRoute>
              {children}
            </ProtectedRoute>
            <Toaster />
          </AuthProvider>
        </AmplifyProvider>
      </body>
    </html>
  )
} 