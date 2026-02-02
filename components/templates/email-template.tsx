
import { Button } from "../ui/button";
import Link from "next/link";


export const EmailTemplate = (link:string)=> {
  return (
    <div>
      <div>
        <p>Click here here to conform your email</p>
          <Button 
            asChild
            variant="link"
            size="sm"
            >
              <Link href={link}>Click here</Link>
          </Button>
      </div>
    </div>
  );
}