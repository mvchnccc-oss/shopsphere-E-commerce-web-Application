import { authOptions } from "@/lib/auth";
import { GetProfileResponse } from "@/lib/interfaces/profile.interface";
import { getServerSession } from "next-auth";
import ProfileSection from "./_components/profile-section";

export default async function Profile() {
  const session = await getServerSession(authOptions);
  const { token } = session!;

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`, {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  });
  const body: GetProfileResponse | null = response.ok ? await response.json() : null;

  return <ProfileSection data={body} />;
}
