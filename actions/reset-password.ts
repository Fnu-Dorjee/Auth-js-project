"use server"

import * as z from "zod";
import { db } from "@/lib/db";
import { resetPasswordSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";


export const resetPassword = async(value:z.infer<typeof resetPasswordSchema>)=>{

    const validatedEmail = resetPasswordSchema.safeParse(value);

    if(!validatedEmail.success){
        
        return {error: "Invalid email!"}
    }
    const {email} = validatedEmail.data;
   
    const user = await getUserByEmail(email);

    if(!user){
        return {error: "Email doesn't exist in our system!"}
    }

    // generate token 
    const generatedToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(generatedToken.email, generatedToken.token);

    return {success: "Reset email sent!"}
}