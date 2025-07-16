"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useCountries } from "@/hooks/use-countries"
import { useAuthStore } from "@/lib/stores/auth-store"
import { ThemeToggle } from "@/components/theme-toggle"
import { Loader2 } from "lucide-react"

const loginSchema = z.object({
  countryCode: z.string().min(1, "Please select a country"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { countries, isLoading: countriesLoading } = useCountries()
  const { sendOTP } = useAuthStore()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const countryCode = watch("countryCode")

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      await sendOTP(data.countryCode + data.phoneNumber)
      toast("OTP Sent" ,{
        description: "Please check your phone for the verification code.",
      })
      router.push(`/auth/verify?phone=${encodeURIComponent(data.countryCode + data.phoneNumber)}`)
    } catch (error) {
      toast("Error" ,{
        description: "Failed to send OTP. Please try again."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md bg-white/80 dark:bg-gray-900/80">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to Gemini Chat</CardTitle>
          <CardDescription>Enter your phone number to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={countryCode}
                onValueChange={(value) => setValue("countryCode", value)}
                disabled={countriesLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue  placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.dialCode}>
                      <div className="flex items-center gap-2">
                        <span>{country.flag}</span>
                        <span>{country.name}</span>
                        <span className="text-muted-foreground">({country.dialCode})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.countryCode && <p className="text-sm text-destructive">{errors.countryCode.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="flex">
                <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-white/80 dark:bg-gray-900/80 text-muted-foreground">
                  {countryCode || "+1"}
                </div>
                <Input {...register("phoneNumber")} type="tel" placeholder="1234567890" className="rounded-l-none" />
              </div>
              {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || countriesLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {"Don't have an account? "}
              <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/auth/signup")}>
                Sign up
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
