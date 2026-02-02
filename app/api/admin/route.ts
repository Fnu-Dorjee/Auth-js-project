import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

export async function GET(){
    const session = await auth();
    const role = session?.user.role;
    const user = await currentUser();

    if(role === UserRole.ADMIN){
        return new NextResponse(null, {status: 200})
    }
    
    return new NextResponse(null,{status: 403})
}