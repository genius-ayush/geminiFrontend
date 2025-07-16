"use client"

import { useState, useEffect } from "react"

export interface Country {
  name: string
  code: string
  dialCode: string
  flag: string
}

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // Simulate API call to restcountries.com
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock country data (in real app, fetch from restcountries.com)
        const mockCountries: Country[] = [
          { name: "United States", code: "US", dialCode: "+1", flag: "🇺🇸" },
          { name: "United Kingdom", code: "GB", dialCode: "+44", flag: "🇬🇧" },
          { name: "Canada", code: "CA", dialCode: "+1", flag: "🇨🇦" },
          { name: "Australia", code: "AU", dialCode: "+61", flag: "🇦🇺" },
          { name: "Germany", code: "DE", dialCode: "+49", flag: "🇩🇪" },
          { name: "France", code: "FR", dialCode: "+33", flag: "🇫🇷" },
          { name: "Japan", code: "JP", dialCode: "+81", flag: "🇯🇵" },
          { name: "South Korea", code: "KR", dialCode: "+82", flag: "🇰🇷" },
          { name: "India", code: "IN", dialCode: "+91", flag: "🇮🇳" },
          { name: "China", code: "CN", dialCode: "+86", flag: "🇨🇳" },
          { name: "Brazil", code: "BR", dialCode: "+55", flag: "🇧🇷" },
          { name: "Mexico", code: "MX", dialCode: "+52", flag: "🇲🇽" },
          { name: "Russia", code: "RU", dialCode: "+7", flag: "🇷🇺" },
          { name: "Italy", code: "IT", dialCode: "+39", flag: "🇮🇹" },
          { name: "Spain", code: "ES", dialCode: "+34", flag: "🇪🇸" },
        ]

        setCountries(mockCountries.sort((a, b) => a.name.localeCompare(b.name)))
      } catch (error) {
        console.error("Failed to fetch countries:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCountries()
  }, [])

  return { countries, isLoading }
}
