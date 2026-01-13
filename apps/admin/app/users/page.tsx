import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { usersApi } from "@/lib/api";
import { Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/delete-button";
import { ResetPasswordButton } from "@/components/reset-password-button";
import { UserList } from "@/components/user-list";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    redirect("/");
  }

  let users: import("@/lib/api").CreatedUser[] = [];
  try {
    users = await usersApi.getAll();
  } catch (error) {
    console.error("Failed to fetch users:", error);
  }

  return (
    <div className="flex-1 space-y-6 p-6 lg:p-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage admin users and access.
          </p>
        </div>
        <Link href="/users/new">
          <Button className="gap-2 cursor-pointer">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      <UserList users={users} />
    </div>
  );
}
