
'use client'

import { useRouter } from "next/navigation";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "../ui/dialog";
import LoginForm from "./login-form";

type LoginBtnProps = {
    children: React.ReactNode;
    mode?: "modal" | "redirect";
    asChild?: boolean;

}

const LoginBtn = ({
    mode="redirect", 
    asChild, 
    children}:LoginBtnProps)=>{

        const router = useRouter();

        const onClick = ()=>{
            router.push('/auth/login');
        }

        if (mode  === "modal"){
            return (
                <Dialog>
                    <DialogTrigger asChild>
                        {children}
                    </DialogTrigger>
                    <DialogContent className="P-0 w-auto bg-transparent border-none">
                    <VisuallyHidden>
                        <DialogTitle>Sign in</DialogTitle>
                    </VisuallyHidden>
                        <LoginForm />
                    </DialogContent>
                </Dialog>
            )
        }


    return(
        <span 
            onClick={onClick}
            className="cursor-pointe ">{children}</span>
    )
};

export default LoginBtn;