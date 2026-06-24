interface TopBarProps {
  siteTitle?: string;
  onSearchOpen: () => void;
}

export function TopBar({ onSearchOpen }: TopBarProps) {
  return (
    <div className="sticky top-0 z-10 flex justify-between items-center px-10 py-4 bg-bg/80 backdrop-blur-sm border-b border-border-gray">
      <div className="flex items-center gap-4">
        {/* Mobile menu button - hidden on desktop */}
        <button className="md:hidden p-2 text-text-dim hover:text-text-primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Search */}
        <button
          onClick={onSearchOpen}
          className="relative bg-white/5 hover:bg-white/10 border border-border-gray rounded-md pl-10 pr-16 py-1.5 text-sm w-64 text-left text-text-dim hover:text-text-primary transition-colors"
        >
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Search...</span>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-text-dim font-mono">
            Ctrl K
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        {/* GitHub / external link placeholder */}
        <button className="p-2 text-text-dim hover:text-text-primary transition-colors" title="GitHub">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
