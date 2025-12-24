"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { KeyRound } from "lucide-react";
import { usersApi } from "@/lib/api";
import { toast } from "sonner";

export function ResetPasswordButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    try {
      await usersApi.resetPassword(id);
      toast.success("Password reset to '123'");
      setOpen(false);
      router.refresh();
    } catch (err) {
      const error = err as Error;
      console.error("Reset error:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
        >
          <KeyRound className="h-4 w-4" />
          Reset
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset Password?</DialogTitle>
          <DialogDescription>
            Are you sure you want to reset password for <strong>{name}</strong>?
            <br />
            The new password will be <strong>123</strong>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReset}
            disabled={loading}
            className="bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
