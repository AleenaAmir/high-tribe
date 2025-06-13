import { z } from 'zod';

export const signupSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Please enter a valid email address'),
    phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(15, 'Password must not exceed 15 characters')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/^\S*$/, 'Password must not contain spaces'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    agreeToTerms: z.boolean().refine((val) => val === true, {
        message: 'You must agree to the terms and conditions',
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export type SignupInput = z.infer<typeof signupSchema>; 