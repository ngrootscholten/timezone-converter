import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Timezone converter',
  description: 'Timezone converter to help plan meetings.',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
