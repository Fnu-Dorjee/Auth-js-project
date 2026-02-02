
"use client"

import { 
    DropdownMenu , 
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "../ui/dropdown-menu";

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { LogoutBtn } from "./logout-button";

import { FaUser } from "react-icons/fa";
import { LogOut } from "lucide-react";
import { useCurrentUser } from "@/hooks/use-current-user";


export const  UserBtn = ()=>{
    const user = useCurrentUser();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage  src={user?.image|| ""} className="object-cover w-full h-full"/>
                    <AvatarFallback className="bg-sky-700">
                        <FaUser className="text-white" size={30}/>
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="end">

                <LogoutBtn>
                    <DropdownMenuItem className="flex justify-between">Sign out <LogOut /></DropdownMenuItem>
                </LogoutBtn>
                
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

