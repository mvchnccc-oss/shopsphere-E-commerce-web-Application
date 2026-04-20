import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { LogInIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import PasswordInput from "../_components/password-input";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm absolute top-[50vh] left-[50vw] -translate-1/2">
      <CardHeader className="flex flex-col items-center ">
        <div className=" bg-accent p-2 shadow-md rounded-lg mb-2">
          <LogInIcon className="size-10" />
        </div>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <MailIcon />
                </InputGroupAddon>
                <InputGroupInput id="email" type="email" placeholder="m@example.com" required />
              </InputGroup>
            </div>
            <PasswordInput />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-4">
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Link href="/auth/register" className="text-muted-foreground text-sm">
          Create a new account instead
        </Link>
      </CardFooter>
    </Card>
  );
}
