import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-soft">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 品牌 */}
          <div>
            <Link href="/" className="text-lg font-bold text-text">
              Go<span className="text-accent">Pick</span> AI
            </Link>
            <p className="mt-2 text-sm text-text-secondary leading-body">
              帮全球华人挑出最值得用的 AI 工具。不做最全的，只做最适合你的。
            </p>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="font-semibold text-sm text-text mb-3">快速链接</h4>
            <div className="space-y-2">
              <Link href="/tools" className="block text-sm text-text-secondary hover:text-accent transition-colors">
                工具库
              </Link>
              <Link href="/blog" className="block text-sm text-text-secondary hover:text-accent transition-colors">
                博客
              </Link>
            </div>
          </div>

          {/* 社交和声明 */}
          <div>
            <h4 className="font-semibold text-sm text-text mb-3">关注我们</h4>
            <div className="flex gap-4">
              <a href="https://twitter.com/gopickai" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://youtube.com/@gopickai" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors" aria-label="YouTube">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="mailto:hello@gopick.ai" className="text-text-muted hover:text-accent transition-colors" aria-label="邮箱">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* 底部声明 */}
        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-[11px] text-text-muted/60 leading-body">
            本站含推广链接，通过链接购买不增加您的费用。详情见关于页面。
          </p>
          <p className="mt-3 text-xs text-text-muted">
            &copy; 2026 GoPick AI. 帮你挑出最值得用的 AI 工具。
          </p>
        </div>
      </div>
    </footer>
  );
}
