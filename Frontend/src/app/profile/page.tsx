import { authOptions } from "@/lib/auth";
import { GetProfileResponse } from "@/lib/interfaces/profile.interface";
import { AlertCircle } from "lucide-react";
import { getServerSession } from "next-auth";
import ProfileSection from "./_components/profile-section";

function normalizeRole(role?: string | null): "Seller" | "Admin" | "Customer" {
  if (!role) return "Customer";
  if (role === "ROLE_SELLER" || role === "Seller") return "Seller";
  if (role === "ROLE_ADMIN" || role === "Admin") return "Admin";
  return "Customer";
}

export default async function Profile() {
  const session = await getServerSession(authOptions);
  const { token } = session!;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`, {
      method: "GET",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
          <AlertCircle className="w-16 h-16 mb-4 text-red-500" />
          <p className="text-lg font-medium">Failed to load profile</p>
          <p className="text-sm mt-1">Please try again later</p>
        </div>
      );
    }

    const body: GetProfileResponse | null = await response.json();

    // Merge role from API response and normalize role names for UI
    const role = normalizeRole(body?.role ?? (session as any).role);
    const data = body ? { ...body, role } : null;

    return <ProfileSection data={data} />;
  } catch (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
        <AlertCircle className="w-16 h-16 mb-4 text-red-500" />
        <p className="text-lg font-medium">Failed to load profile</p>
        <p className="text-sm mt-1">Network error occurred</p>
      </div>
    );
  }
}
