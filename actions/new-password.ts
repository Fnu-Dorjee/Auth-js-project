"use server"
import * as z from "zod";
import bcrypt from "bcryptjs";
import { resetNewPasswordSchema } from "@/schemas";

import { db } from "@/lib/db"
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";


export const newPassword = async(
    values: z.infer<typeof resetNewPasswordSchema>,
    token: string | null,
)=>{

    if(!token) return {error: "Missing token."}

    const validatedFields = resetNewPasswordSchema.safeParse(values);

    if(!validatedFields.success) return {error: "Invalid fields!"};

    const {password} = validatedFields.data;

    const existingToken = await getPasswordResetTokenByToken(token);

    if(!existingToken) return {error: "Invalid token!"};

    const hasTokenExpired = new Date(existingToken.expires) < new Date();

    if(hasTokenExpired) return {error: "Token has expired!"};

    const existingUser = await getUserByEmail(existingToken.email);

    if(!existingUser) return {error: "Email does not exist!"};

    //hashing the password that entered by a user
    const hashedPasword = await bcrypt.hash(password, 12);

    await db.user.update({
        where: {id: existingUser.id},
        data:{
            password: hashedPasword}
    });

    await db.passwordResetToken.delete({
        where: {id: existingToken.id}
    });


    return {success: "Password updated"}
}