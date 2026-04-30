import { authOptions } from "@/lib/auth";
import { GetProfileResponse } from "@/lib/interfaces/profile.interface";
import { getServerSession } from "next-auth";
import ProfileSection from "./_components/profile-section";

export default async function Profile() {
  const session = await getServerSession(authOptions);
  const { token } = session!;
  const isSeller = (session as any).isSeller ?? false;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  const body: GetProfileResponse | null = response.ok ? await response.json() : null;

  // Merge isSeller from session (more reliable than API in some cases)
  const data = body ? { ...body, isSeller: body.isSeller ?? isSeller } : null;

  return <ProfileSection data={data} />;
}
