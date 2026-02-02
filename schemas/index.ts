
import { UserRole } from '@prisma/client';
import * as z from 'zod';

export const settingsSchema = z.object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),

}).refine((data)=>{
    // Check 1: Current password without new password
    if(data.password && !data.newPassword){
        return false;
    }
    return true;
}, {
    message: "New password is required when providing current password",
    path: ["newPassword"]
}).refine((data)=>{
    // Check 2: New password without current password
    if(data.newPassword && !data.password){
        return false;
    }
    return true;
}, {
    message: "Current password is required when setting new password",
    path: ["password"]
})


export const resetPasswordSchema = z.object({
    email:  z.string()
    .trim()
    .email("Please enter a valid email address")
    .transform(val => val.toLowerCase()),
});

export const resetNewPasswordSchema = z.object({
    password:  z.string().min(6, {message: "menimum of 6 characters required"})
    
});

export const loginSchema = z.object({
    email: z.string()
        .trim()
        .email("email is required")
        .transform(val => val.toLowerCase()),

    password:z.string().min(1, "Password is required"),

    code: z.optional(z.string())
});


export const twoFactorSchema = z.object({
  code: z.string().min(6, "Enter 6 digit code"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .transform(val => val.replace(/\s+/g, " ")),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .toLowerCase()
    .refine(email => {
      const commonTypos = new Set([
        "gamil.com",
        "gmial.com",
        "yaho.com",
        "hotmal.com",
      ]);

      const domain = email.split("@")[1];
      return domain ? !commonTypos.has(domain) : true;
    }, "Check your email domain"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be less than 72 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
});

