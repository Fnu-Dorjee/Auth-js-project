

'use server'
import * as z from "zod"
//prisma instance that connect to main db
import { db } from "@/lib/db"
//***** */
import bcrypt from "bcryptjs"
import { registerSchema } from "@/schemas"

import { getUserByEmail, getUserById } from "@/data/user";

import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"


export const signup = async(data: z.infer<typeof registerSchema>)=>{

    const validatedFields = registerSchema.safeParse(data);

    if(!validatedFields.success){
        return {error: 'Something went wrong!'}
    }

    const {name,email,password} = validatedFields.data;

    const hashedPassword = await bcrypt.hash(password,12);

    const existingUser = await getUserByEmail(email);

    if(existingUser){
        return {error: "This email is already in our system!"}
    }

    await db.user.create({
        data: {
            name, 
            email,
            password:hashedPassword
        }
    })
    //Send verification token email
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.email, verificationToken.token)

    return {success: "Confirmaton email sent!"}
    
}