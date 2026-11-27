"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  AtSign,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Smile,
  Sparkles,
  X,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid";

function usernameStatusFor(username: string): UsernameStatus | null {
  if (!username) return null;
  if (username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) return "invalid";
  return null;
}

function passwordStrength(password: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  if (!password) return { score: 0, label: "Nhập mật khẩu" };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[0-9]/.test(password) && /[a-zA-Z]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;
  const labels = ["Quá yếu", "Yếu", "Trung bình", "Khá mạnh", "Mạnh"];
  return { score: score as 0 | 1 | 2 | 3 | 4, label: labels[score] };
}

export function RegisterForm({ isModal }: { isModal: boolean }) {
  const router = useRouter();
  const { register, checkUsername } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const localIssue = usernameStatusFor(username);
    if (localIssue) {
      setUsernameStatus(localIssue);
      return;
    }
    if (!username) {
      setUsernameStatus("idle");
      return;
    }
    setUsernameStatus("checking");
    const timer = setTimeout(() => {
      checkUsername(username)
        .then((available) => setUsernameStatus(available ? "available" : "taken"))
        .catch(() => setUsernameStatus("idle"));
    }, 400);
    return () => clearTimeout(timer);
  }, [username, checkUsername]);

  const strength = useMemo(() => passwordStrength(password), [password]);
  const passwordTooShort = password.length > 0 && password.length < 8;

  const canSubmit =
    displayName.trim().length > 0 &&
    username.length >= 3 &&
    usernameStatus === "available" &&
    password.length >= 8 &&
    !isSubmitting;

  function close() {
    if (isModal) router.back();
    else router.push("/");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    try {
      await register(displayName.trim(), username, password);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tạo tài khoản thất bại");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative w-full max-w-[440px] overflow-hidden rounded-3xl bg-card p-8 shadow-2xl">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-80 -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/25 via-primary/5 to-transparent blur-2xl" />

      {isModal && (
        <button
          aria-label="Đóng cửa sổ"
          onClick={close}
          className="absolute right-6 top-6 z-10 flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-all hover:bg-muted/70 hover:text-foreground active:scale-95"
        >
          <X className="size-5" />
        </button>
      )}

      <div className="relative z-10 flex flex-col items-start gap-3">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-entity-shared/20 text-primary shadow-[0_0_24px_-2px_rgba(255,90,60,0.35)]">
          <Sparkles className="size-[22px]" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">Bắt đầu hành trình</span>
          <h2 className="mt-0.5 font-heading text-3xl font-bold tracking-tight">Tạo nhật ký mới</h2>
          <p className="mt-1 text-sm text-muted-foreground">Chỉ mất 10 giây để lưu giữ mọi khoảnh khắc.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative z-10 mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="display-name" className="text-sm font-medium text-foreground">
            Tên hiển thị <span className="text-primary">*</span>
          </label>
          <div className="relative flex items-center">
            <Smile className="absolute left-3.5 size-5 text-muted-foreground" />
            <input
              id="display-name"
              type="text"
              required
              placeholder="vd: Đình Dũng"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="h-12 w-full rounded-xl bg-muted pl-11 pr-4 text-sm outline-none transition-all focus:shadow-[0_0_14px_rgba(255,90,60,0.25)]"
            />
          </div>
          <span className="pl-1 text-xs text-muted-foreground">Hiển thị trên trang nhật ký và Boarding Pass</span>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="username" className="text-sm font-medium text-foreground">
            Tên đăng nhập <span className="text-primary">*</span>
          </label>
          <div className="relative flex items-center">
            <AtSign className="absolute left-3.5 size-5 text-muted-foreground" />
            <input
              id="username"
              type="text"
              required
              placeholder="dinhdung"
              value={username}
              onChange={(e) => setUsername(e.target.value.trim().toLowerCase())}
              className="h-12 w-full rounded-xl bg-muted pl-11 pr-32 text-sm outline-none transition-all focus:shadow-[0_0_14px_rgba(255,90,60,0.25)]"
            />
            <UsernameBadge status={usernameStatus} />
          </div>
          {usernameStatus === "invalid" && username.length > 0 && (
            <span className="pl-1 text-xs text-destructive">
              Chỉ dùng chữ, số và dấu gạch dưới, tối thiểu 3 ký tự
            </span>
          )}
          {usernameStatus === "taken" && (
            <span className="flex items-center gap-1 pl-1 text-xs text-destructive">
              <AlertCircle className="size-3" />
              Tên đăng nhập đã được sử dụng
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-foreground">
            Mật khẩu <span className="text-primary">*</span>
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 size-5 text-muted-foreground" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full rounded-xl bg-muted pl-11 pr-11 text-sm tracking-wider outline-none transition-all focus:shadow-[0_0_14px_rgba(255,90,60,0.25)]"
            />
            <button
              type="button"
              aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 p-1 text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>

          <div className="mt-1.5 flex w-full items-center gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full",
                  i < strength.score ? "bg-gradient-to-r from-primary to-entity-shared" : "bg-muted",
                )}
              />
            ))}
          </div>
          <div className="flex items-center justify-between px-0.5 text-xs">
            <span className={cn("font-medium", passwordTooShort ? "text-destructive" : "text-primary")}>
              {passwordTooShort ? "Mật khẩu cần ít nhất 8 ký tự" : strength.label}
            </span>
            <span className="text-muted-foreground">Tối thiểu 8 ký tự</span>
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
          disabled={!canSubmit}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-entity-shared text-sm font-semibold text-white shadow-[0_0_24px_-4px_rgba(255,90,60,0.45)] transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="size-[18px] animate-spin" /> : <Sparkles className="size-[18px]" />}
          <span>{isSubmitting ? "Đang tạo..." : "Tạo tài khoản"}</span>
        </button>

        <p className="px-2 text-center text-xs leading-tight text-muted-foreground">
          Người khác có thể xem nhật ký chung, chỉ bạn mới có quyền chỉnh sửa.
        </p>

        <div className="pt-2 text-center text-sm text-muted-foreground">
          <span>Đã có tài khoản? </span>
          <Link href="/login" className="ml-1 font-semibold text-primary transition-colors hover:brightness-110">
            Đăng nhập
          </Link>
        </div>
      </form>
    </div>
  );
}

function UsernameBadge({ status }: { status: UsernameStatus }) {
  if (status === "checking") {
    return (
      <div className="absolute right-3 flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
        <Loader2 className="size-3.5 animate-spin" />
        <span>Đang kiểm tra</span>
      </div>
    );
  }
  if (status === "available") {
    return (
      <div className="absolute right-3 flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
        <CheckCircle2 className="size-3.5" />
        <span>Có thể dùng</span>
      </div>
    );
  }
  if (status === "taken" || status === "invalid") {
    return (
      <div className="absolute right-3 flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
        <XCircle className="size-3.5" />
      </div>
    );
  }
  return null;
}
