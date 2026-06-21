'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { data: session } = useSession();
  const totalItems = useCartStore((s) => s.totalItems());
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="font-serif text-xl tracking-wide">
            管理后台
          </Link>
          <nav className="hidden md:flex gap-8 text-sm text-muted-foreground">
            <Link
              href="/shop"
              className="hover:text-foreground transition-colors"
            >
              商店首页
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              产品管理
            </Link>
            <Link
              href="/categories"
              className="hover:text-foreground transition-colors"
            >
              分类管理
            </Link>
            {session && (
              <Link
                href="/orders"
                className="hover:text-foreground transition-colors"
              >
                我的订单
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="切换主题"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </Button>
          <Link href="/cart" className="relative">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
              购物车
              {totalItems > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-[11px] font-medium bg-foreground text-background rounded-full">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {session.user?.name || session.user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                退出
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                登录
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
