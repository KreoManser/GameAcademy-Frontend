'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function UnityCleanup() {
  const pathname = usePathname()
  useEffect(() => {
    if (!pathname.includes('/play')) {
      document
        .querySelectorAll('script[src*="UnityLoader.js"]')
        .forEach(s => s.remove())
    }
  }, [pathname])
  return null
}