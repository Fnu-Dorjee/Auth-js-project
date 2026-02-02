
"use client"

import { useCallback, useEffect, useState } from "react";

import {BeatLoader} from "react-spinners"
import { useSearchParams } from "next/navigation"

import { newVerification } from "@/actions/new-verification";

import { CardWrapper } from "../card/card-wrapper"
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { is } from "zod/v4/locales";


export const NewVerificationForm = ()=>{
    const [isError, setIsError] = useState<string | undefined>();
    const [isSuccess, setIsSuccess] = useState<string | undefined>();

    const searchParam = useSearchParams();
    const token = searchParam.get("token");

    const onSubmit = useCallback(async()=>{
        if(!token){
            setIsError("Missing token");
            return;
        }

        await newVerification(token)
        .then((data)=>{
            setIsSuccess(data.success);
            setIsError(data.error);
        }).catch(()=>{
            setIsError("Sorry something went wrong!")
        });
        console.log("token: ", token);
    }, [token]);
    

    useEffect(()=>{
        onSubmit();
    },[onSubmit])

    return(
        
        <CardWrapper 
            headerLabel="Confirming your verification" 
            backBtnLabel="Back to login" 
            backBtnHref="/auth/login"
            >
                <div className="flex items-center  w-full justify-center">
                    {!isSuccess && !isError && (<BeatLoader />)}

                    <FormError message={isError}/>
                    <FormSuccess message={isSuccess}/>
                </div>
        </CardWrapper>
        
    )
}