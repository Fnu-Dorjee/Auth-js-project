
import { db } from "@/lib/db";

export const getPasswordResetTokenByToken = async(token: string)=>{
    try{
        const passwordResetToken = await db.passwordResetToken.findUnique({
            where: {token:token}  //token: token // comparing tokens 
        })
        return passwordResetToken;
    }catch{
        return null;
    }

};


export const getPasswordResetTokenByEmail = async(email: string)=>{
    try{
        const passwordResetToken = await db.passwordResetToken.findFirst({
            where: {email} //finding the matching email --one passed in param and one present in db

        })
        return passwordResetToken;
    }catch{
        return null;
    }
}
