'use client'
import React, { useState } from 'react'
import { ThemeToggle } from '../theme-toggle'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

function Verify() {
  const searchParams = useSearchParams() ; 
  const router = useRouter() ;
  const [isLoading , setIsLoading] = useState(false) ;  
  const [countdown , setCountdown] = useState(30) ;
  const[canResend , setCanResend] = useState(false) ; 
  const phone = searchParams.get("phone") || "" ; 
  const name = searchParams.get("name") || ""
  return (
    <div className='min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray:800'>
        <div className='absolute top-4 right-4'><ThemeToggle/></div>

        <Card className='w-full max-w-md'>
            <CardHeader className='text-center'>
                <Button variant='ghost' size="sm" className='absolute left-4 top-4' onClick={()=>router.back()}>
                <ArrowLeft className='h-4 w-4'/>
                </Button>
                <CardTitle className='text-2xl font-bold'>Verify OTP</CardTitle>
                <CardDescription>Enter the 6-digit code sent to {phone}</CardDescription>
            </CardHeader>
        </Card>
    </div>
  )
}

export default Verify