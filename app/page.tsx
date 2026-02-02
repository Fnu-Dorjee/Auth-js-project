
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import LoginBtn from "@/components/auth/login-btn";

import { Card,CardContent } from "@/components/ui/card";

const font = Poppins({
  subsets: ['latin'],
  weight: ["600"]
});

export default function Homepage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-sky-700">
      <Card className="bg-slate-100 p-4">
        <CardContent>

          <div className="space-y-6 text-center">
            <h1 className={cn("text-5xl font-semibold text-gray-700 drop-shadow-md",
              font.className
            )}>
              🔐 AuthJS
            </h1>
            <p className="text-gray-600text-lg">A simple Next Auth service</p>
              <LoginBtn mode= "modal">
                <Button variant="outline" size='lg'>Sign in</Button>
              </LoginBtn>
            
          </div>

        </CardContent>

      </Card>
     
    </main>
  );
}
