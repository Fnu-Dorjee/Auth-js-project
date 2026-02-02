
'use server'
import * as z from 'zod';

import { loginSchema } from "@/schemas";
//signIn 
import { signIn } from '@/auth';

import { db } from '@/lib/db';

import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { AuthError } from 'next-auth';
import { getUserByEmail } from '@/data/user';

import { generateVerificationToken } from '@/lib/tokens';
import { generateTwoFactorToken } from '@/lib/tokens';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';
import { getTwoFactorConfirmationByUserId } from '@/data/two-factor-confirmation';

import { 
    sendVerificationEmail, 
    sendTwoFactorTokenEmail 
} from '@/lib/mail';


export const login = async(
    values:z.infer<typeof loginSchema>,
    callbackUrl?: string | null
)=>{

    const validatedFields = loginSchema.safeParse(values);

    if(!validatedFields.success){
        return {error: 'Invalid fields'}
    }
  

    const {email, password, code} = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if(!existingUser || !existingUser.email || !existingUser.password){
        return {error: "Email does not exist yet!"}
    }

    if(!existingUser.emailVerified){
        const verificationToken = await generateVerificationToken(existingUser.email);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);
        return {success: "Confirmation email sent!"}
    }
            //2FA 
    if(existingUser.isTwoFactorsEnabled && existingUser.email){
        if(code){
            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
            if (!twoFactorToken || twoFactorToken.token !== code) {
                return { error: "Invalid code!" };
            }

            const hasTwoFactorTokenExpired = new Date(twoFactorToken.expires) < new Date();
            if(hasTwoFactorTokenExpired) return {error: "Code expired!"};

            await db.twoFactorToken.delete({
                where: {id: twoFactorToken.id}
            });
            
            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

            if(existingConfirmation){
                await db.twoFactorConfirmation.delete({
                    where: {id: existingConfirmation.id}
                })
            }

            await db.twoFactorConfirmation.create({
                data: {
                    userId: existingUser.id
                }
            })


        }else{
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
            return {twoFactor: true}
        }
    }

    try{
        await signIn("credentials",{
            email,
            password,
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        }
    )
    }catch(error){
        if(error instanceof AuthError){
            switch(error.type){
                case "CredentialsSignin":
                    return {error: "Invalid credentials!"}
                default:
                    return {error: "Sorry, something went wrong!"}
            }
        }
        throw error;
    }


    // 4. TODO: Generate session/token
    // 5. TODO: Set cookies


    return {success: 'Email sent!'};
    
};