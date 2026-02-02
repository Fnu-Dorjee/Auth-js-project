
"use client"
import * as z from "zod" ;

import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema } from "@/schemas";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
     Form, 
     FormField, 
     FormLabel, 
     FormItem, 
     FormMessage,
     FormControl,
     FormDescription
    } from "../ui/form";

import { FormSuccess } from "../form-success";
import { FormError } from "../form-error";

import { 
    Select, SelectContent, 
    SelectItem, SelectTrigger, 
    SelectValue 
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { UserRole } from "@prisma/client";

type SettingFormProps = {
    onSubmit: (values: z.infer<typeof settingsSchema>) => void;
    isPending: boolean;
    error: string | undefined;
    success: string | undefined;
}


export const SettingForm = ({onSubmit, isPending, error, success}: SettingFormProps)=>{
    const user = useCurrentUser();
    const form = useForm({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            password: undefined,
            newPassword: undefined,
            name:  user?.name || undefined,
            email: user?.email || undefined,
            role: user?.role || undefined,
            isTwoFactorEnabled: user?.isTwoFactorsEnabled || undefined,

        }
    })

    const {handleSubmit} = form;

    return (
        <Form {...form}>
            <form 
                onSubmit={handleSubmit(onSubmit)} 
                className="space-y-6"
            >
                 <div className="space-y-4">

                    <FormField 
                        control={form.control}
                        name = "name"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel >Name</FormLabel>
                                <FormControl>
                                    <Input 
                                        {...field}
                                        placeholder="tenzin"
                                        disabled={isPending}
                                    
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    
                    />
                    {user?.isOAuth === false && (
                <>
                    <FormField 
                        control={form.control}
                        name = "email"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel >Email</FormLabel>
                                <FormControl>
                                    <Input 
                                        {...field}
                                        type="email"
                                        placeholder="tenzin@gmail.com"
                                        disabled={isPending}
                                    
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    
                    />

                    <FormField 
                        control={form.control}
                        name = "password"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel >Password</FormLabel>
                                <FormControl>
                                    <Input 
                                        {...field}
                                        placeholder="******"
                                        disabled={isPending}
                                        type="password"
                                    
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    
                    />

                    <FormField 
                        control={form.control}
                        name = "newPassword"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel >New Password</FormLabel>
                                <FormControl>
                                    <Input 
                                        {...field}
                                        placeholder="******"
                                        type="password"
                                        disabled={isPending}
                                    
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    
                    />

                </>
                        )}
                    <FormField 
                        control={form.control}
                        name = "role"
                        render={({field})=>(
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select 
                                    disabled={isPending}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >

                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role"/>
                                    </SelectTrigger>
                                </FormControl>

                                <SelectContent>
                                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                                    <SelectItem value={UserRole.USER}>User</SelectItem>
                                    
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    
                    />
                    {user?.isOAuth === false && (

                    <FormField 
                        control={form.control}
                        name = "isTwoFactorEnabled"
                        render={({field})=>(
                            <FormItem className=" flex flex-row items-center 
                            justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>Two Factor Authentication</FormLabel>
                                    <FormDescription>Enable two factor authentication for your account.</FormDescription>
                                </div>
                                
                                <FormControl>
                                    <Switch 
                                    checked={field.value} 
                                    onCheckedChange={field.onChange}
                                    disabled={isPending}/>
                                </FormControl>
                            </FormItem>
                        )}
                    
                    />
                )}

                 </div>
                 <FormError message={error}/>
                 <FormSuccess message={success}/>
                <Button 
                    variant="outline"
                    type="submit"
                    disabled={isPending}
                    >
                    
                        Save
                </Button>
                
            </form>
        </Form>
    )
};