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
import { Trash2 } from "lucide-react";

import { useSession } from "next-auth/react";

export function DeleteButton({
  id,
  title,
  endpoint,
  variant = "ghost",
}: {
  id: string;
  title: string;
  endpoint: string;
  variant?: "ghost" | "outline" | "destructive";
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";

      const headers: HeadersInit = {};
      if (session?.accessToken) {
        headers["Authorization"] = `Bearer ${session.accessToken}`;
      }

      const res = await fetch(`${apiUrl}/${endpoint}/${id}`, {
        method: "DELETE",
        headers,
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Failed to delete (${res.status})`);
      }

      setOpen(false);
      router.refresh();
    } catch (err) {
      const error = err as Error;
      console.error("Delete error:", error);
      alert(
        error.message ||
          "Network error. Please check if API server is running on port 3002."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className={
            variant === "ghost"
              ? "gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              : variant === "outline"
                ? "gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                : "gap-2"
          }
        >
          <Trash2 className="h-4 w-4" />
          {variant === "outline" ? "" : "Delete"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This will permanently delete <strong>{title}</strong>. This action
            cannot be undone.
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
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
