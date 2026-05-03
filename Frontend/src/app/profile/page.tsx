import { authOptions } from "@/lib/auth";
import { GetProfileResponse } from "@/lib/interfaces/profile.interface";
import { getServerSession } from "next-auth";
import ProfileSection from "./_components/profile-section";
import { AlertCircle } from "lucide-react";

export default async function Profile() {
  const session = await getServerSession(authOptions);
  const { token } = session!;
  const isSeller = (session as any).isSeller ?? false;

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

    // Merge isSeller from session (more reliable than API in some cases)
    const data = body ? { ...body, isSeller: body.isSeller ?? isSeller } : null;

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
