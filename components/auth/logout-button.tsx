"use client"
import { logout } from "@/actions/logout"

import { Button } from "../ui/button"

type LogoutBtnProps = {
    children: React.ReactNode
}

export const LogoutBtn = ({children}: LogoutBtnProps)=>{
    const onClick = ()=>{
        logout()
    }
    return (
        <span onClick={onClick} className="cursor-pointer">{children}</span>
    )
}