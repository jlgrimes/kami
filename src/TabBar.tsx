// iOS 26-style floating tab bar — glass pill that floats above the home indicator

import { hapticMedium } from '../haptics';

interface Tab {
  id: string;
  icon: string;    // character or emoji used as icon
  label: string;
}

interface TabBarProps<T extends string> {
  tabs: Tab[];
  activeTab: T;
  onChange: (tab: T) => void;
}

export function TabBar<T extends string>({ tabs, activeTab, onChange }: TabBarProps<T>) {
  return (
    // outer div is full-width pointer-events-none so content underneath is still tappable
    <div
      className="fixed bottom-0 left-0 right-0 flex justify-center z-50 pointer-events-none"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 10px)' }}
    >
      {/* Glass pill */}
      <div className="pointer-events-auto flex bg-[var(--surface-bg)] backdrop-blur-2xl rounded-full shadow-[0_4px_32px_rgba(0,0,0,0.18)] border border-[var(--surface-border)] p-1.5 gap-1">
        {tabs.map(tab => (
          <TabButton
            key={tab.id}
            icon={tab.icon}
            label={tab.label}
            active={activeTab === tab.id}
            onClick={() => { hapticMedium(); onChange(tab.id as T); }}
          />
        ))}
      </div>
    </div>
  );
}

function TabButton({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex flex-col items-center gap-0.5 px-5 py-2 rounded-full min-w-[72px]',
        'transition-all duration-200 select-none active:scale-[0.93]',
        active
          ? 'bg-[var(--color-ink)]'
          : 'bg-transparent',
      ].join(' ')}
    >
      <span className={`text-lg leading-none font-black ${active ? 'text-white' : 'text-gray-400'}`}>
        {icon}
      </span>
      <span className={`text-[10px] font-mono uppercase tracking-widest ${active ? 'text-white/70' : 'text-gray-400'}`}>
        {label}
      </span>
    </button>
  );
}
