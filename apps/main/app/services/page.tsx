"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ServicesPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/services/advertising");
  }, [router]);

  return null; // Or a loading spinner if desired
}
