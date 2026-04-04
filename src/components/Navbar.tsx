"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navLinks = [
    { href: "/", label: "首页" },
    { href: "/tools", label: "工具库" },
    { href: "/blog", label: "博客" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-text">
          Get<span className="text-accent">Pick</span>AI
        </Link>

        {/* 桌面端导航 */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text-secondary hover:text-text transition-colors text-sm font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* 右侧操作区 */}
        <div className="flex items-center gap-3">
          {/* 深色模式切换 */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-btn flex items-center justify-center hover:bg-bg-muted transition-colors"
            aria-label="切换深色模式"
          >
            {theme === "light" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
          </button>

          {/* 移动端汉堡菜单 */}
          <button
            className="md:hidden w-9 h-9 rounded-btn flex items-center justify-center hover:bg-bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="菜单"
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 移动端下拉菜单 */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-bg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-text-secondary hover:text-text transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
