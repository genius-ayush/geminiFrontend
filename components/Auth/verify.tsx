'use client'
import React, { useEffect, useRef, useState } from 'react'
import { ThemeToggle } from '../theme-toggle'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Form, useForm } from 'react-hook-form'
import { otpSchema } from '@/lib/schema'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@/lib/stores/auth-store'
import { toast } from "sonner"
import { Input } from '../ui/input'
import { Label } from '../ui/label'


function Verify() {
  const searchParams = useSearchParams() ; 
  const router = useRouter() ;
  const [isLoading , setIsLoading] = useState(false) ;  
  const [countdown , setCountdown] = useState(30) ;
  const[canResend , setCanResend] = useState(false) ; 
  const phone = searchParams.get("phone") || "" ; 
  const name = searchParams.get("name") || "" ; 
  const { verifyOTP, sendOTP } = useAuthStore()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const isSignup = searchParams.get("signup") === "true"
 type OTPForm = z.infer<typeof otpSchema>
 const {
  register,
  handleSubmit,
  setValue,
  watch,
  formState: { errors },
} = useForm<OTPForm>({
  resolver: zodResolver(otpSchema),
})

const otpValue = watch("otp") || ""

useEffect(()=>{
  if(countdown>0){
    const timer = setTimeout(()=> setCountdown(countdown-1),1000)

    return ()=> clearTimeout(timer) ; 
  }else{
    setCanResend(true) ; 
  }
} , [countdown])

const handleOTPChange = (index: number, value: string) => {
  if (value.length > 1) return

  const newOTP = otpValue.split("")
  newOTP[index] = value
  const updatedOTP = newOTP.join("")

  setValue("otp", updatedOTP)

  if (value && index < 5) {
    inputRefs.current[index + 1]?.focus()
  }
}

const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
  if (e.key === "Backspace" && !otpValue[index] && index > 0) {
    inputRefs.current[index - 1]?.focus()
  }
}

const onSubmit = async (data: OTPForm) => {
  setIsLoading(true)
  try {
    await verifyOTP(phone, data.otp, isSignup ? name : undefined)
    toast("Success" ,{
      description: isSignup ? "Account created successfully!" : "Logged in successfully!",
    })
    router.push("/dashboard")
  } catch (error) {
    toast("Error" , {
      description: "Invalid OTP. Please try again.",
    })
  } finally {
    setIsLoading(false)
  }
}
 const handleResendOTP = async () => {
    try {
      await sendOTP(phone, isSignup ? name : undefined)
      setCountdown(30)
      setCanResend(false)
      toast("OTP Resent" ,{
        description: "A new OTP has been sent to your phone.",
      })
    } catch (error) {
      toast("Error" ,{
        description: "Failed to resend OTP. Please try again.",
      })
    }
  }
  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800'>
        <div className='absolute top-4 right-4'><ThemeToggle/></div>

        <Card className='w-full max-w-md bg-white/80 dark:bg-gray-900/80'>
            <CardHeader className='text-center'>
                <Button variant='ghost' size="sm" className='absolute left-4 top-4' onClick={()=>router.back()}>
                <ArrowLeft className='h-4 w-4'/>
                </Button>
                <CardTitle className='text-2xl font-bold'>Verify OTP</CardTitle>
                <CardDescription>Enter the 6-digit code sent to {phone}</CardDescription>
            </CardHeader>

            <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label>Verification Code</Label>
              <div className="flex gap-2 justify-center">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Input
                    key={index}
                    //@ts-ignore
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otpValue[index] || ""}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold"
                  />
                ))}
              </div>
              {errors.otp && <p className="text-sm text-destructive text-center">{errors.otp.message}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading || otpValue.length !== 6}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">{"Didn't receive the code?"}</p>
            {canResend ? (
              <Button variant="link" onClick={handleResendOTP}>
                Resend OTP
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">Resend in {countdown}s</p>
            )}
          </div>
        </CardContent>
        </Card>
    </div>
  )
}

export default Verify