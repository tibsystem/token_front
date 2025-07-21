"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/v3"); // Redirect to /dashboard/v3
  }, [router]);

  return null;
}