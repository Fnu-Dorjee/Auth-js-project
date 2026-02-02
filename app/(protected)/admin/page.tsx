
"use client"
import { toast } from "sonner";
import { admin } from "@/actions/admin";
import { Card, CardHeader, CardContent} from "@/components/ui/card";

import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { UserRole } from "@prisma/client";
import { Button } from "@/components/ui/button";

const AdminPage = ()=>{
   
    const serverActionClick = async()=>{
        const data = await admin();
        if(data.error){
            toast.error(data.error, {position:"bottom-right"})
        }
        if(data.success){
            toast.success(data.success,{position:"bottom-right"})
        }

    };

    const onApiRouteClick = async()=>{
        const response = await fetch("/api/admin");
        if(response.ok){
            toast.success("Allowed API Route!",{position: "top-right"})
        }else{
            toast.error("NOT PERMITTED",{position: 'top-right'})
        }
    }

    return (
        <Card className="w-2xl">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">Admin</p>
            </CardHeader>
            <CardContent className="space-y-4">
                <RoleGate allowedRole={UserRole.ADMIN}>
                    <FormSuccess message="Welcome! Only admin can see this!"/>
                </RoleGate>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">Admin-only API route</p>
                    <Button 
                        onClick={onApiRouteClick}
                        variant="outline">View page</Button>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
                    <p className="text-sm font-medium">Admin-only Server Action</p>
                    <Button 
                        onClick={serverActionClick}
                        variant="outline">
                            View page
                    </Button>
                </div>
            </CardContent>

        </Card>
    )
};

export default AdminPage;