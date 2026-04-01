"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

type UserInfo = {
  displayName: string | null;
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<UserInfo | null>(null);

  // Her sayfa / rota değiştiğinde kullanıcıyı tekrar kontrol et
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        setUser(null);
        return;
      }

      const u = data.user;
      const metaName =
        (u.user_metadata as any)?.display_name ||
        u.email?.split("@")[0] ||
        u.email ||
        null;

      setUser({ displayName: metaName });
    }

    loadUser();
  }, [pathname]);

  function isActive(href: string) {
    return pathname === href;
  }

  async function handleLogout() {
    setUser(null);
    await supabase.auth.signOut();
    router.push("/auth");
  }

  const homeHref = user ? "/dashboard" : "/";

  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Sol: Logo + marka adı → tıklanabilir */}
        <Link
          href={homeHref}
          className="flex items-center gap-3 rounded-md transition hover:opacity-90"
          aria-label="Go to homepage"
        >
          <img
            src="/logo.png"
            alt="CertificationData logo"
            className="h-10 w-10 rounded-md border border-slate-700 bg-slate-900 object-contain"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-base md:text-lg font-semibold text-slate-100">
              CertificationData
            </span>
            <span className="text-xs text-slate-500">
              Certify your digital work
            </span>
          </div>
        </Link>

        {/* Orta: nav linkleri */}
        <nav className="hidden md:flex items-center gap-5 text-sm">
          <Link
            href="/pricing"
            className={
              "hover:text-emerald-400 transition " +
              (isActive("/pricing") ? "text-emerald-400" : "text-slate-300")
            }
          >
            Pricing
          </Link>
          <Link
            href="/how-it-works"
            className={
              "hover:text-emerald-400 transition " +
              (isActive("/how-it-works") ? "text-emerald-400" : "text-slate-300")
            }
          >
            How It Works
          </Link>
          <Link
            href="/verify"
            className={
              "hover:text-emerald-400 transition " +
              (isActive("/verify") ? "text-emerald-400" : "text-slate-300")
            }
          >
            Verify Certificate
          </Link>
          <Link
            href="/archive"
            className={
              "hover:text-emerald-400 transition " +
              (isActive("/archive") ? "text-emerald-400" : "text-slate-300")
            }
          >
            Public Archive
          </Link>
        </nav>

        {/* Sağ: kullanıcı alanı */}
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={
                  "inline-flex items-center px-3 py-1.5 rounded-md border text-xs font-medium transition " +
                  (pathname.startsWith("/dashboard")
                    ? "border-emerald-500 text-emerald-300 bg-slate-900"
                    : "border-slate-700 text-slate-200 hover:border-emerald-500 hover:text-emerald-300")
                }
              >
                Dashboard
              </Link>

              <Link
                href="/account"
                className={
                  "hidden sm:inline-flex items-center px-3 py-1.5 rounded-md border text-xs font-medium transition " +
                  (pathname.startsWith("/account")
                    ? "border-emerald-500 text-emerald-300 bg-slate-900"
                    : "border-slate-700 text-slate-200 hover:border-emerald-500 hover:text-emerald-300")
                }
              >
                Hello,&nbsp;
                <span className="font-medium">
                  {user.displayName || "User"}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="text-xs text-slate-400 hover:text-red-300 transition"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              className="inline-flex items-center px-3 py-1.5 rounded-md bg-emerald-500 text-slate-950 text-xs font-medium hover:bg-emerald-400 transition"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}