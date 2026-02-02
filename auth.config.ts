

import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google";

import { getUserByEmail } from "./data/user";
import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
import { loginSchema } from "./schemas";
import bcrypt from "bcryptjs";


export default { 
    providers: [
        GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }), 
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }), 
       

        Credentials({
            name:"Email & Password",
            async authorize(credentials){
                const validatedFields = loginSchema.safeParse(credentials);
                if(validatedFields.success){
                    const {email, password} = validatedFields.data;
                    const user = await getUserByEmail(email);

                    if(!user || !user.password) return null;

                    const isPasswordMatch = await bcrypt.compare(password,user.password );

                    if(isPasswordMatch){
                        return user;
                    }

                }
                return null;
            }
            
        })
    ] 
} satisfies NextAuthConfig
