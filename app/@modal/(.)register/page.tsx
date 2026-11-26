"use client";

import { useRouter } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";

export default function InterceptedRegisterPage() {
  const router = useRouter();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md"
      onClick={() => router.back()}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <RegisterForm isModal />
      </div>
    </div>
  );
}
