
type CardWrapperProps = {
    children: React.ReactNode;
    headerLabel: string;
    backBtnLabel: string;
    backBtnHref: string;
    showSocial?: boolean;

}

import { Card, CardContent, CardHeader, CardFooter } from "../ui/card"
import { Header } from "../auth/header";
import { Social } from "../auth/social";
import { BackButton } from "../auth/back-button";

export const CardWrapper = ({
    children,
    headerLabel,
    backBtnLabel,
    backBtnHref,
    showSocial
}:CardWrapperProps)=>{
    return (
        <Card className="max-w-md sm:w-2xl shadow-md">
            <CardHeader><Header label={headerLabel}/></CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {showSocial && (
                <CardFooter >
                    <Social/>
                </CardFooter>
            )}
            <CardFooter>
                <BackButton href={backBtnHref} label={backBtnLabel}/>
            </CardFooter>
        </Card>
    )
}