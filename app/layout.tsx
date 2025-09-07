import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'hi, i am minerva!',
  description: 'An intelligent tutoring system with AI Syllabus and AI Teacher agents powered by Gemini',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-system">
        {children}
      </body>
    </html>
  )
}
