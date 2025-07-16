import * as z from 'zod' ;

export const signupSchema = z.object({
    name : z.string().min(2 , 'Name must be at least 2 characters'),
    countryCode: z.string().min(1 , 'pPlease seect a country'), 
    phoneNumber : z.string().min(10, "Phone number must be at least 10 digits").regex(/^\d+$/, "Phone number must contain only digits"),
})


export const otpSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must contain only digits"),
  })
