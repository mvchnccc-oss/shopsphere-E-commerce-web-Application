import { ReactNode } from "react";

export default function ErrorBox({ children }: { children: ReactNode }) {
  return (
    <p className="text-sm text-destructive text-center bg-destructive/10 py-2 px-3 rounded-md">
      {children}
    </p>
  );
}
