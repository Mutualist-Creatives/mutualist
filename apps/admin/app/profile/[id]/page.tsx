import { auth } from "@/lib/auth";
import { ProfileForm } from "@/components/profile-form";
import { usersApi } from "@/lib/api";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  let user;

  try {
    user = await usersApi.getById(id);
  } catch (error) {
    return <div>Failed to load profile. {String(error)}</div>;
  }

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {user.id === session.user.id ? "My Profile" : `Profile: ${user.name}`}
        </h2>
      </div>
      <ProfileForm user={user} />
    </div>
  );
}
