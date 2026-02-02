

import { Button } from "../ui/button"
import Link from "next/link"

type BackbtnProps = {
    label: string;
    href: string
}

export const BackButton = ({label, href}:BackbtnProps)=>{
    return (
        <Button 
            variant="link"
            className="font-normal w-full"
            asChild
            >
            <Link href={href} className="text-sm text-slate-700">{label}</Link>
        
        </Button>
    )
}