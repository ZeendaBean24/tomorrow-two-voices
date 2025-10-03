import type { ReactNode } from 'react';
export type TabItem = {
  id: string;
  label: string;
  badge?: ReactNode;
};

type TabsProps = {
  tabs: ReadonlyArray<TabItem>;
  activeTab: string;
  onChange: (id: string) => void;
};

const Tabs = ({ tabs, activeTab, onChange }: TabsProps) => (
  <div className="group relative flex items-center gap-2" role="tablist" aria-label="Story perspectives">
    {tabs.map((tab, index) => {
      const isActive = tab.id === activeTab;
      return (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          aria-controls={`${tab.id}-panel`}
          id={`${tab.id}-tab`}
          onClick={() => onChange(tab.id)}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:focus-ring ${
            isActive ? 'bg-indigo text-white shadow' : 'bg-paper/85 text-slate/70 hover:bg-paper'
          }`}
        >
          {tab.label}
          {tab.badge}
          {index === 0 && tabs.length > 1 && (
            <span
              aria-hidden="true"
              className="ml-2 h-6 w-[2px] bg-gradient-to-b from-emerald via-indigo to-rust opacity-0 transition group-hover:opacity-100 group-hover:animate-gradient-slide"
            />
          )}
        </button>
      );
    })}
  </div>
);

export default Tabs;
