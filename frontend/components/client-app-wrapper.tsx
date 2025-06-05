"use client"

import React from 'react'
import { AppWithUrlSync } from '@/components/app-with-url-sync'

interface ClientAppWrapperProps {
  children?: React.ReactNode
}

export default function ClientAppWrapper({ children }: ClientAppWrapperProps) {
  // The AppWithUrlSync component handles all routing internally
  // Children are not used as it manages its own view rendering
  return <AppWithUrlSync />
} 