import { ReactNode } from 'react';

interface TabItem {
  value: string;
  label: string;
}

interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange: (value: string) => void;
}

export function Tabs({ tabs, value, onChange }: TabsProps) {
  return (
    <div className="flex flex-wrap gap-2 rounded-full bg-[#171A22] p-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${value === tab.value ? 'bg-[#22C55E] text-[#090A0C]' : 'text-[#A0A8BC] hover:bg-white/[0.04] hover:text-white'}`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
