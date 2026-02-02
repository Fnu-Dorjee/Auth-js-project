

import NextAuth from "next-auth";

import authConfig from "./auth.config";

import {PrismaAdapter} from "@auth/prisma-adapter";
//my db
import { db } from "./lib/db";

import { getUserById } from "./data/user";
// For typescript 
import { UserRole } from "@prisma/client";

import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/account";


export const {auth,handlers, signIn, signOut} = NextAuth({
    ...authConfig,
    adapter: PrismaAdapter(db),
    session: {strategy: 'jwt'},
    pages :{
        signIn: "/auth/login",
        error: '/auth/error'
    },
    events: {
        async linkAccount({user, account, profile}){
            await db.user.update({
                where:{id: user.id},
                data: {emailVerified: new Date()}
            })
        },
        async updateUser({user}){

        }

       
    },
    callbacks:{
        async signIn({user,account}){
            //allow OAuth without email verification
            if(account?.provider !== "credentials" )return true;
            //prevent signin without email verified
            const existingUser = await getUserById(user.id!);
            if(!existingUser?.emailVerified) return false;

            //2FACTOR AUTH
            if(existingUser?.isTwoFactorsEnabled){;

                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
               
                if(!twoFactorConfirmation) return false;

                // Delete 2fa confirmation for next sign in
                await db.twoFactorConfirmation.delete({
                    where: {id: twoFactorConfirmation.id}
                });

            }

            return true;
        },

        async session({session, token}){
            console.log({sessiontoken: token, session})

            if(session.user && token.sub){
            session.user.id = token.sub;
            
            }

            if(token.role && session.user){
                session.user.role = token.role as UserRole;
            }

            if(token.isTwoFactorEnabled && session.user){
                session.user.isTwoFactorsEnabled = token.isTwoFactorsEnabled as boolean;
            }

            if(session.user){
                session.user.name = token.name;
                session.user.isOAuth= token.isOAuth as boolean;
            }
            return session;


        },
        async jwt({token}){
            console.log("I AM BEING CALLED AGAIN");
            if(!token.sub) return token;

            const existingUser = await getUserById(token.sub);
            if(!existingUser) return token;

            const existingAccount = await getAccountByUserId(existingUser.id);

            token.isOAuth = !!existingAccount;


            token.name = existingUser.name;
            token.email = existingUser.email;

            //assigning ROLE
            token.role = existingUser.role;
            token.isTwoFactorsEnabled = existingUser.isTwoFactorsEnabled;
            //console.log("token: ", token)
            
            return token; 
        }
    },


});