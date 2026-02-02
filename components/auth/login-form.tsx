
'use client'

import * as z from 'zod'
import Link from 'next/link';
import { loginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import { useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
//state
import { useState} from 'react';
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
import {login} from "@/actions/login";


const LoginForm = ()=>{
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [isError, setIsError] = useState<string | undefined>("");
    const [isSuccess, setIsSuccess] = useState<string | undefined>("");

    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver:zodResolver(loginSchema),
        defaultValues:{
            email: '',
            password: '',
            code: ''
        },
        mode: "onChange",
        reValidateMode: "onChange"
    })

    const formSubmitHandler = (data:z.infer<typeof loginSchema>)=>{
       
        startTransition(async()=>{
            try{
                
                const result = await login(data, callbackUrl);

                if(result?.error){
                    setIsError(result.error)
                    setIsSuccess("")

                }
                if(result?.success){
                    setIsSuccess(result.success);
                    setIsError('');
                    form.reset()
                }

                if(result?.twoFactor){
                    setShowTwoFactor(true);
                    setIsError("")
                    // Clear the code field when showing 2FA input
                    form.setValue("code", "");
                }

                console.log(data);
            }catch (error) {
                setIsError("Something went wrong. Please try again.")
            }
        })
        
    }

    return(
        <CardWrapper 
            headerLabel="Welcome back"
            backBtnLabel={showTwoFactor? "Back to login": "Don't have an account?"}
            backBtnHref="/auth/register"
            showSocial = {!showTwoFactor}
            >
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(formSubmitHandler)}
                    className='space-y-6'
                    >
                        <div className='space-y-6'>
                            { 
                            showTwoFactor && 
                            (
                            <>
                            <FormField 
                                control={form.control} 
                                name='code'
                                render={({field})=> (
                                    <FormItem>
                                        <FormLabel>Two Factor Code</FormLabel>
                                        <FormControl>
                                            <Input 
                                                {...field}
                                                disabled={isPending}
                                                placeholder="123456"
                                                
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>

                                </>
                            ) 
                        }
                        {!showTwoFactor &&
                            (<>
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

                                        <Button 
                                            asChild
                                            variant="link" 
                                            size="sm"
                                            className='font-normal px-0'
                                            >
                                                <Link href="/auth/reset-password"> Forgot password?</Link>
                                                
                                        </Button>
                                    </FormItem>
                                )}/>
                                </>)
                            }
                                
                        </div>
                       
                        <FormError message={isError} /> 
                       
                        <FormSuccess message={isSuccess}/> 
                     
                       
                        
                        <Button 
                            type="submit" 
                            disabled={isPending}
                            className="w-full font-semibold">
                                {showTwoFactor? "Confirm" : "Login"}
            
                        </Button>
                        
                </form>
            </Form>
        </CardWrapper>
    )
};

export default LoginForm;