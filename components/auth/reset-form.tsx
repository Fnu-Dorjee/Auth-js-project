

'use client'

import * as z from 'zod'

import { resetPasswordSchema } from '@/schemas';
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

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
import { resetPassword } from '@/actions/reset-password';

export const ResetForm = ()=>{
    const [isError, setIsError] = useState<string | undefined>("");
    const [isSuccess, setIsSuccess] = useState<string | undefined>("");

    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver:zodResolver(resetPasswordSchema),
        defaultValues:{
            email: '',
        },
        mode: "onChange",
        reValidateMode: "onChange"
    })

    const formSubmitHandler = (email:z.infer<typeof resetPasswordSchema>)=>{
        startTransition(async()=>{
            const result = await resetPassword(email);
            if(result?.error){
                setIsError(result.error)
                setIsSuccess("")
            }
            if(result?.success){
                setIsSuccess(result.success);
                setIsError('');
                form.reset()
            }

            console.log("email", email);
        })
        
    }
    return(
        <CardWrapper 
            headerLabel="Forgot your password?"
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
                                name='email'
                                render={({field})=> (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                disabled={isPending}
                                                placeholder="hello@example.com"
                                                type='email'
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
                                { isPending ? "Sending reset email...": "Send reset email"}
                        </Button>
                        
                </form>
            </Form>
        </CardWrapper>
    )
};

