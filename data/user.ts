
import { db } from "@/lib/db";

export const getUserByEmail = async(email:string)=>{
    try{
        const userByEmail = await db.user.findUnique({
            where:{email}
        });
        return userByEmail;
    }catch{
        return null;
    }
    
}

export const getUserById = async(id:string)=>{
    try{
        const userById = await db.user.findUnique({
            where: {id}
        })
        return userById;
    }catch{
        return null
    }
}
