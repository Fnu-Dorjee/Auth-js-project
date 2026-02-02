"use client";

import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserBtn } from "@/components/auth/user-btn";


export const Navbar = ()=>{
    const pathname = usePathname();
    return (
        <nav className="bg-secondary flex justify-between items-center 
                    p-4 rounded-xl w-2xl shadow-sm">
            <div className="flex gap-x-2">

                <Button 
                    asChild
                    variant={pathname === "/server"? "default": "outline"}
                >
                <Link href='/server'>Server</Link>
               </Button>

               <Button 
                    asChild
                    variant={pathname === "/client"? "default": "outline"}
                >
                <Link href='/client'>Client</Link>
               </Button>

               <Button 
                    asChild
                    variant={pathname === "/admin"? "default": "outline"}
                >
                <Link href='/admin'>Admin</Link>
               </Button>

               <Button 
                    asChild
                    variant={pathname === "/settings"? "default": "outline"}
                >
                <Link href='/settings'>Settings</Link>
               </Button>

            </div>
            <UserBtn />
        </nav>
    )
}
export default Navbar;

