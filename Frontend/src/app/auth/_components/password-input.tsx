"use client";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react";
import { useState } from "react";

export default function PasswordInput() {
  const [isVisible, setVisible] = useState(false);

  return (
    <div className="grid gap-2">
      <Label htmlFor="password">Password</Label>
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <LockIcon />
        </InputGroupAddon>
        <InputGroupInput id="password" type={isVisible ? "text" : "password"} required />
        <InputGroupAddon align="inline-end">
          <Button variant="ghost" type="button" onClick={() => setVisible(!isVisible)}>
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
