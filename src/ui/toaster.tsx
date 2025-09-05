"use client"

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/ui/toast"

export function Toaster() {
  // Simple implementation without useToast hook
  return (
    <ToastProvider>
      <ToastViewport />
    </ToastProvider>
  )
}
