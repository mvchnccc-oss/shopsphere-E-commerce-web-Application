import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface ProfileFieldProps {
  isEdit: boolean;
  label: ReactNode;
  id: string;
  textValue: string;
  registeration: UseFormRegisterReturn;
  error?: string;
}

export default function ProfileField(props: ProfileFieldProps) {
  return (
    <div className="grid gap-2">
      <Label className="text-muted-foreground" htmlFor="name-field">
        {props.label}
      </Label>
      {props.isEdit ? (
        <>
          <Input id={props.id} {...props.registeration} />
          {props.error && <span className="text-destructive text-sm">{props.error}</span>}
        </>
      ) : (
        <span id="name-field" className="text-sm">
          {props.textValue}
        </span>
      )}
    </div>
  );
}
