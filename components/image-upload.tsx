"use client"

import type React from "react"

import { forwardRef } from "react"

interface ImageUploadProps {
  onImageUpload: (file: File) => void
}

export const ImageUpload = forwardRef<HTMLInputElement, ImageUploadProps>(({ onImageUpload }, ref) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      onImageUpload(file)
    }
    // Reset the input
    if (e.target) {
      e.target.value = ""
    }
  }

  return <input ref={ref} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
})

ImageUpload.displayName = "ImageUpload"
