// components/ModalPortal.jsx
'use client'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export default function ModalPortal({ open, onClose, children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Lock background scroll while modal is open
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [open])

  // Close on ESC
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open || !mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      {children}
    </div>,
    document.body
  )
}
