import type { Theme } from "../hooks/useTheme";

interface ThemeToggleProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const themes: { value: Theme; icon: JSX.Element; title: string }[] = [
  {
    value: "light",
    title: "Light Mode",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" clipRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
      </svg>
    ),
  },
  {
    value: "system",
    title: "System",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" clipRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.33 1.55.03.1a1 1 0 01-1.94.4l-.66-3.1a1 1 0 01.97-1.2h2.52V5H5v8h2.52a1 1 0 01.97 1.2l-.66 3.1a1 1 0 01-1.94-.4l.03-.1.33-1.55H5a2 2 0 01-2-2V5z" />
      </svg>
    ),
  },
  {
    value: "dark",
    title: "Dark Mode",
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" clipRule="evenodd" d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
    ),
  },
];

export function ThemeToggle({ theme, setTheme }: ThemeToggleProps) {
  const cycle = () => {
    const order: Theme[] = ["light", "system", "dark"];
    const idx = order.indexOf(theme);
    setTheme(order[(idx + 1) % order.length]);
  };

  const current = themes.find((t) => t.value === theme)!;

  return (
    <div className="fixed bottom-6 right-10 flex items-center bg-white/5 border border-border-gray rounded-full p-1 gap-1 z-30 shadow-2xl backdrop-blur-md">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`p-2 rounded-full transition-colors ${
            t.value === theme
              ? "bg-accent-blue/20 text-accent-blue"
              : "text-text-dim hover:text-text-primary"
          }`}
          title={t.title}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
}
