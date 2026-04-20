"use client";

import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon, LockIcon } from "lucide-react";
import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";

interface PasswordInputProps {
  id?: string;
  label?: string;
  registration?: UseFormRegisterReturn;
  error?: string;
}

export default function PasswordInput({
  id = "password",
  label = "Password",
  registration,
  error,
}: PasswordInputProps) {
  const [isVisible, setVisible] = useState(false);

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <LockIcon />
        </InputGroupAddon>
        <InputGroupInput
          id={id}
          type={isVisible ? "text" : "password"}
          aria-invalid={!!error}
          {...registration}
        />
        <InputGroupAddon align="inline-end">
          <Button
            variant="ghost"
            type="button"
            onClick={() => setVisible(!isVisible)}
          >
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
          </Button>
        </InputGroupAddon>
      </InputGroup>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
