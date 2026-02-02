"use client"
import * as z from "zod"
import { useState } from "react";
import {useForm} from 'react-hook-form';
import { registerSchema } from '@/schemas';
import { signup } from "@/actions/signup";

import { CardWrapper } from "../card/card-wrapper"
import { Input } from '../ui/input';

import { 
    Form, FormField, FormControl, 
    FormItem,
    FormMessage, FormLabel
} from "../ui/form"

import { Button } from '../ui/button';
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

import { zodResolver } from '@hookform/resolvers/zod';
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export const  SignupForm = ()=>{
    const [isError, setIsError ] = useState<string | undefined>("");
    const [isSuccess, setIsSuccess] = useState<string | undefined>('');

    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const form = useForm({
        resolver:zodResolver(registerSchema),
        defaultValues:{
            name: "",
            email: "",
            password:"",
        },
        mode: 'onChange',
        reValidateMode:"onChange"
    })

    const signupFormHandler = (data:z.infer<typeof registerSchema>)=>{
        startTransition(async()=>{
            const result = await signup(data);
            if(result?.success){
                setIsSuccess(result.success);
                setIsError("");
                form.reset();
            }
            if(result?.error){
                setIsError(result.error);
                setIsSuccess("");
            }
        })
        
    };

    return(
        <CardWrapper 
            headerLabel="Create an account" 
            backBtnHref="/auth/login" 
            backBtnLabel="Already have account?"
            showSocial
            >
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(signupFormHandler)}
                    className='space-y-6'>
                    <div className="space-y-6">
                        <FormField  
                            control={form.control}
                            name="name"
                            render ={({field})=>(
                                <FormItem>
                                    <FormLabel>name</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            type= 'name'
                                            placeholder='example'
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField  
                            control={form.control}
                            name="email"
                            render ={({field})=>(
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            type= 'email'
                                            placeholder='example@gmail.com'
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField  
                            control={form.control}
                            name="password"
                            render ={({field})=>(
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input 
                                            {...field}
                                            type= 'password'
                                            placeholder='.........'
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </div>
                    <FormError message={isError} />
                    <FormSuccess message={isSuccess}/>
                    <Button 
                        type='submit'
                        disabled={isPending}
                        className='w-full font-semibold' >
                            { isPending? "Signing up ....":"Sign up"}
                    </Button>
                </form>
            </Form>
            
        </CardWrapper>
    )
}