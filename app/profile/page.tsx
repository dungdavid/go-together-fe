"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { ChevronRight, Moon, Bell, UserRound, Info, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/layout/page-header";
import { useAuth } from "@/lib/auth-context";

export default function ProfilePage() {
  const { resolvedTheme, setTheme } = useTheme();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [mounted, isLoading, isAuthenticated, router]);

  function handleSignOut() {
    logout();
    router.push("/");
  }

  if (!mounted || isLoading || !user) {
    return (
      <div className="pb-24 md:pb-10">
        <PageHeader title="Hồ sơ" />
      </div>
    );
  }

  return (
    <div className="pb-24 md:pb-10">
      <PageHeader title="Hồ sơ" />

      <div className="mx-auto max-w-2xl px-4 md:px-8">
        <Card className="flex flex-row items-center gap-4 p-5">
          <Avatar className="size-14">
            <AvatarFallback className="bg-primary/10 text-primary font-heading text-lg">
              {user.displayName.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{user.displayName}</p>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </Card>

        <Card className="mt-6 p-0">
          <SettingsRow icon={Moon} label="Chế độ tối">
            <Switch
              checked={resolvedTheme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            />
          </SettingsRow>
          <Separator />
          <SettingsRow icon={Bell} label="Thông báo" trailing />
          <Separator />
          <SettingsRow icon={UserRound} label="Tài khoản" trailing />
          <Separator />
          <SettingsRow icon={Info} label="Giới thiệu Nhật Ký Xê Dịch" trailing />
        </Card>

        <Card className="mt-6 p-0">
          <button className="w-full" onClick={handleSignOut}>
            <SettingsRow icon={LogOut} label="Đăng xuất" destructive trailing />
          </button>
        </Card>
      </div>
    </div>
  );
}

function SettingsRow({
  icon: Icon,
  label,
  trailing,
  destructive,
  children,
}: {
  icon: React.ElementType;
  label: string;
  trailing?: boolean;
  destructive?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5 min-h-[52px]">
      <div className="flex items-center gap-3">
        <Icon className={destructive ? "size-4 text-destructive" : "size-4 text-muted-foreground"} />
        <span className={destructive ? "text-sm text-destructive" : "text-sm"}>{label}</span>
      </div>
      {children ?? (trailing && <ChevronRight className="size-4 text-muted-foreground" />)}
    </div>
  );
}
