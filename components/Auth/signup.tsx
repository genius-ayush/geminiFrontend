'use client'
import { useForm } from "react-hook-form"
import { ThemeToggle } from "../theme-toggle"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupSchema } from "@/lib/schema"
import { useCountries } from "@/hooks/use-countries"
import { toast } from "sonner"
import { useState } from "react"
import { Button } from "../ui/button"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
type SignupForm = z.infer<typeof signupSchema>

function Signup() {
    const [isLoading, setIsLoading] = useState(false);
    const { countries, isLoading: countriesLoading } = useCountries();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<SignupForm>({
        resolver: zodResolver(signupSchema),
    })
    const { sendOTP } = useAuthStore()
    const onSubmit = async (data: SignupForm) => {
        setIsLoading(true)
        try {
          const phoneNumber = data.countryCode + data.phoneNumber
          await sendOTP(phoneNumber, data.name)
          toast("OTP Sent" ,{
            description: "Please check your phone for the verification code.",
          })
          router.push(
            `/auth/verify?phone=${encodeURIComponent(phoneNumber)}&name=${encodeURIComponent(data.name)}&signup=true`,
          )
        } catch (error) {
          toast("Error" ,{
            description: "Failed to send OTP. Please try again.",
            
          })
        } finally {
          setIsLoading(false)
        }
      }

    const countryCode = watch('countryCode')
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md bg-white/80 dark:bg-gray-900/80">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Sign up to start chatting with Gemini</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input {...register("name")} type="text" placeholder="Enter your full name" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select
                value={countryCode}
                onValueChange={(value) => setValue("countryCode", value)}
                disabled={countriesLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="">
                  {countries.map((country) => (
                    <SelectItem  key={country.code} value={country.dialCode}>
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
                <div className="flex items-center px-3 border border-r-0 rounded-l-md  text-muted-foreground bg-white/80 dark:bg-gray-900/80">
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
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/auth/login")}>
                Sign in
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    )
}

export default Signup