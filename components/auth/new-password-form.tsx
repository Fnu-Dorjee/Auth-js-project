

'use client'

import * as z from 'zod'
import { resetNewPasswordSchema } from '@/schemas';
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

import { useSearchParams } from 'next/navigation';

import { useTransition } from 'react';
//state
import { useState } from 'react';

import { CardWrapper } from "../card/card-wrapper";
import { 
    Form, FormLabel, FormControl,
    FormMessage, FormField, FormItem
} from "../ui/form";

import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { FormError } from '../form-error';
import { FormSuccess } from '../form-success';
//server action
import { newPassword } from '@/actions/new-password';

export const NewPasswordForm = ()=>{
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [isError, setIsError] = useState<string | undefined>("");
    const [isSuccess, setIsSuccess] = useState<string | undefined>("");


    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof resetNewPasswordSchema>>({
        resolver:zodResolver(resetNewPasswordSchema),
        defaultValues:{
            password: '',
        },
        mode: "onChange",
        reValidateMode: "onChange"
    })

    const formSubmitHandler = (values:z.infer<typeof resetNewPasswordSchema>)=>{
        startTransition(async()=>{
            const result = await newPassword(values, token);
            if(result?.error){
                setIsError(result.error)
                setIsSuccess("")
            }
            if(result?.success){
                setIsSuccess(result.success);
                setIsError('');
                form.reset()
            }

        })
        
    }
    return(
        <CardWrapper 
            headerLabel="Enter a new password"
            backBtnLabel="Back to login"
            backBtnHref="/auth/login"
            >
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(formSubmitHandler)}
                    className='space-y-6'
                    >
                        <div className='space-y-6'>
                            <FormField 
                                control={form.control} 
                                name='password'
                                render={({field})=> (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                disabled={isPending}
                                                placeholder="......"
                                                type='password'
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>

                        </div>
                       
                        <FormError message={isError} /> 
                       
                        <FormSuccess message={isSuccess}/> 
                    
                        <Button 
                            type="submit" 
                            className="w-full font-semibold">
                                { isPending ? "Resetting password...": "Reset password"}
                        </Button>
                        
                </form>
            </Form>
        </CardWrapper>
    )
};
