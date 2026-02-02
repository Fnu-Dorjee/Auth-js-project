

"use client"

import * as z from "zod";

import { settings } from "@/actions/settings";
import { settingsSchema } from "@/schemas";
import { SlidersVertical } from "lucide-react";



import {  useTransition, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { SettingForm } from "@/components/auth/setting-form";

const SettingsPage = ()=>{


    const [isError, setIsError] = useState<string | undefined>();
    const [isSuccess, setIsSuccess] = useState<string | undefined>();

    const {update} = useSession();
    const [isPending, startTransition] = useTransition();


    const onSubmit = (values: z.infer<typeof settingsSchema>)=>{

        startTransition( async()=>{
            const result = await settings(values);

            if(result.error){
                setIsError(result.error);
                
            }
            if(result.success){
                await update();
                setIsSuccess(result.success);
                
            }
            
        })
    
    }

    return(
        <Card className="w-2xl">

            <CardHeader className="flex items-center">
                <div className="flex gap-2 items-center">
                <SlidersVertical size={20}/>
                <p className="text-2xl font-semibold">Settings</p>
                </div>
            
            </CardHeader>

            <CardContent>
                <SettingForm 
                    onSubmit={onSubmit}
                    isPending={isPending}
                    error={isError}
                    success={isSuccess}
                />
                
            </CardContent>
        </Card>
    )
}

export default SettingsPage;