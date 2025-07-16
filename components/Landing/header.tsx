'use client'
import { MessageCircle } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import { ThemeToggle } from '../theme-toggle'
import { useRouter } from 'next/navigation'

function Header() {

    const router = useRouter() ; 
  return (
    <header className='relative z-10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex justify-between items-center h-16'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center'>
                        <MessageCircle className='h-6 w-6 text-white'/>
                    </div>
                    <span className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>Gemini Chat</span>
                </div>

                <div className='flex items-center gap-4'>
                    <ThemeToggle/>
                    <Button className='text-lg px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover-from-blue-600 hover:to-purple-600' variant='outline' onClick={()=> router.push("/auth/signup")}>Get Started</Button>  
                </div>

            </div>

        </div>
    </header>
  )
}

export default Header