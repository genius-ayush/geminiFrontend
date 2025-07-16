import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  name: string
  phone: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  pendingOTP: string | null
  initializeAuth: () => void
  sendOTP: (phone: string, name?: string) => Promise<void>
  verifyOTP: (phone: string, otp: string, name?: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      pendingOTP: null,

      initializeAuth: () => {
        // Simulate loading from localStorage
        setTimeout(() => {
          set({ isLoading: false })
        }, 100)
      },

      sendOTP: async (phone: string, name?: string) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Generate a fake OTP (in real app, this would be sent via SMS)
        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        console.log(`OTP for ${phone}: ${otp}`) // For testing purposes

        set({ pendingOTP: otp })
      },

      verifyOTP: async (phone: string, otp: string, name?: string) => {
        const { pendingOTP } = get()

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (otp !== pendingOTP) {
          throw new Error("Invalid OTP")
        }

        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: name || "User",
          phone,
        }

        set({ user, pendingOTP: null })
      },

      logout: () => {
        set({ user: null, pendingOTP: null })
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    },
  ),
)
