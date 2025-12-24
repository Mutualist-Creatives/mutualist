"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { usersApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

interface ProfileFormProps {
  user: {
    id: string;
    email: string | null;
    name: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const { update: updateSession } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data: Record<string, string> = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.password) {
        data.password = formData.password;
      }

      await usersApi.update(user.id, data);

      // Update session if name/email changed
      await updateSession(data);

      toast.success("Profile updated!");
      router.refresh();
      setFormData({ ...formData, password: "" }); // Clear password
    } catch (err) {
      const error = err as Error;
      console.error(error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4 border p-4 rounded-lg bg-card">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            disabled // Often good to disable email change, but user can re-enable if logic exists
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <p className="text-xs text-muted-foreground">
            Email cannot be changed.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Leave blank to keep current password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="gap-2">
        <Save className="h-4 w-4" />
        {loading ? "Saving..." : "Update Profile"}
      </Button>
    </form>
  );
}
