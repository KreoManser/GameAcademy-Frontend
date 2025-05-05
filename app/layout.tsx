// app/layout.tsx
import type { Metadata } from 'next'
import Header from '../components/header'
import Script from 'next/script'
import './globals.css'
import UnityCleanup from '../components/UnityCleanup'
import ClientWrapper from '../components/ClientWrapper'

export const metadata: Metadata = {
  title: 'Game Academy',
  description: 'Your awesome WebGL games portal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
          strategy="beforeInteractive"
          type="module"
        />
      </head>
      <body>
        <Header />
        <UnityCleanup />
        {/* здесь обёртываем всё содержимое клиентским компонентом */}
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  )
}