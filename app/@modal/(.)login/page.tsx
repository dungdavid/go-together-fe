"use client";

import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";

export default function InterceptedLoginPage() {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md"
      onClick={() => router.back()}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <LoginForm isModal />
      </div>
    </div>
  );
}
