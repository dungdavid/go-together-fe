"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AlertCircle, ArrowRight, Compass, Eye, EyeOff, Loader2, Lock, User, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function LoginForm({ isModal }: { isModal: boolean }) {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function close() {
    if (isModal) router.back();
    else router.push("/");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(username, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="relative w-full max-w-[420px] overflow-hidden rounded-3xl bg-card p-8 shadow-2xl"
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 0%, rgba(255, 90, 60, 0.14) 0%, rgba(24, 24, 27, 0) 70%)",
      }}
    >
      {isModal && (
        <button
          aria-label="Đóng"
          onClick={close}
          className="absolute right-6 top-6 flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}

      <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary shadow-[0_0_24px_-4px_rgba(255,90,60,0.35)]">
        <Compass className="size-5" />
      </div>

      <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-primary">Chào mừng trở lại</div>
      <h1 className="mt-1 font-heading text-3xl font-bold tracking-tight">Đăng nhập</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">Tiếp tục viết nhật ký xê dịch của bạn</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-foreground">
            Tên đăng nhập
          </label>
          <div className="flex h-12 items-center gap-2.5 rounded-xl bg-muted px-3.5 ring-1 ring-inset ring-border transition-all focus-within:shadow-[0_0_12px_rgba(255,90,60,0.25)] focus-within:ring-primary/40">
            <User className="size-5 shrink-0 text-muted-foreground" />
            <input
              id="username"
              type="text"
              required
              autoComplete="username"
              placeholder="vd: dinhdung"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
            Mật khẩu
          </label>
          <div className="flex h-12 items-center justify-between gap-2.5 rounded-xl bg-muted px-3.5 ring-1 ring-inset ring-border transition-all focus-within:shadow-[0_0_12px_rgba(255,90,60,0.25)] focus-within:ring-primary/40">
            <div className="flex w-full items-center gap-2.5">
              <Lock className="size-5 shrink-0 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm tracking-widest outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="button"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
              onClick={() => setShowPassword((v) => !v)}
              className="shrink-0 p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2.5 rounded-xl bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-entity-shared text-sm font-medium text-white shadow-[0_0_20px_-4px_rgba(255,90,60,0.4)] transition-all hover:brightness-110 active:scale-[0.99] disabled:cursor-wait disabled:opacity-80"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>Đang đăng nhập…</span>
            </>
          ) : (
            <>
              <span>Đăng nhập</span>
              <ArrowRight className="size-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        Chưa có nhật ký?
        <Link href="/register" className="ml-1 font-medium text-primary hover:underline">
          Tạo tài khoản
        </Link>
      </div>
    </div>
  );
}
