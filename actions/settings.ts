
"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { settingsSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { auth } from "@/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { Send } from "lucide-react";
import { sendVerificationEmail } from "@/lib/mail";
import bcrypt from "bcryptjs";

export const settings = async(values:z.infer<typeof settingsSchema>)=>{
    const session = await auth();
    const user = session?.user;

    if(!user) return {error: "UNAUTHORIZED!"};
    
    const dbUser = await getUserById(user.id);

    if(!dbUser) return {error: "UNAUTHORIZED!"}

    if(user.isOAuth){
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    };

    if(values.email && values.email !== user.email){
        const existingUser = await getUserByEmail(values.email);

        if(existingUser && existingUser.id !== user.id){
            return {error: "Email already in use."}
        }

        const verificationToken =  await generateVerificationToken(values.email)
        await sendVerificationEmail(verificationToken.email, verificationToken.token)

        return {success: "Verification email is sent!"}
    }

    if(values.password && values.newPassword && dbUser.password){
        const passwordsMatch = await bcrypt.compare(values.password, dbUser.password);
        if(!passwordsMatch){
            return {error: "Incorrect password."}
        }
        const hashedPassword = await bcrypt.hash(values.newPassword, 12);
        values.password = hashedPassword;
        values.newPassword = undefined;
        

    }
    await db.user.update({
        where: {id: dbUser.id},
        data: {...values}
    })

    return {success: "Settings Updated!"}
}

