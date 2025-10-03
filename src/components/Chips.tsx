import type { ReactNode } from 'react';
import {
  EyeIcon,
  EyeSlashIcon,
  UserGroupIcon,
  UserIcon,
  SparklesIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  ExclamationTriangleIcon,
  CpuChipIcon,
} from '@heroicons/react/24/outline';

const baseChipClasses =
  'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium shadow-sm';

type ChipProps = {
  label: string;
  title?: string;
  tone?: 'hope' | 'caution' | 'slate';
  icon?: ReactNode;
};

export const ThemeChip = ({ label, title, tone = 'slate', icon }: ChipProps) => {
  const palette = {
    hope: 'border-emerald/40 bg-emerald/10 text-emerald',
    caution: 'border-rust/40 bg-rust/10 text-rust',
    slate: 'border-slate/25 bg-paper/85 text-slate',
  }[tone];

  return (
    <span className={`${baseChipClasses} ${palette}`} title={title ?? label}>
      {icon}
      {label}
    </span>
  );
};

type CogSciType = 'construal' | 'agency' | 'affect' | 'risk';

const iconForChip = (type: CogSciType, value: string) => {
  switch (type) {
    case 'construal':
      return value.toLowerCase() === 'near' ? <EyeIcon className="h-4 w-4" aria-hidden="true" /> : <EyeSlashIcon className="h-4 w-4" aria-hidden="true" />;
    case 'agency':
      return value.toLowerCase().includes('shared')
        ? <UserGroupIcon className="h-4 w-4" aria-hidden="true" />
        : value.toLowerCase().includes('auto')
          ? <CpuChipIcon className="h-4 w-4" aria-hidden="true" />
          : <UserIcon className="h-4 w-4" aria-hidden="true" />;
    case 'affect': {
      const normalized = value.toLowerCase();
      if (normalized.includes('pos')) {
        return <FaceSmileIcon className="h-4 w-4" aria-hidden="true" />;
      }
      if (normalized.includes('neg')) {
        return <FaceFrownIcon className="h-4 w-4" aria-hidden="true" />;
      }
      return <SparklesIcon className="h-4 w-4" aria-hidden="true" />;
    }
    case 'risk':
    default:
      return <ExclamationTriangleIcon className="h-4 w-4" aria-hidden="true" />;
  }
};

const toneForChip = (type: CogSciType, value: string): ChipProps['tone'] => {
  if (type === 'affect') {
    const normalized = value.toLowerCase();
    if (normalized.includes('pos') || normalized.includes('hope')) return 'hope';
    if (normalized.includes('neg') || normalized.includes('high')) return 'caution';
  }
  if (type === 'risk') {
    const normalized = value.toLowerCase();
    if (normalized.includes('low')) return 'hope';
    if (normalized.includes('high') || normalized.includes('critical')) return 'caution';
  }
  return 'slate';
};

export const CogSciChip = ({ type, value }: { type: CogSciType; value: string }) => (
  <ThemeChip
    label={value}
    tone={toneForChip(type, value)}
    icon={iconForChip(type, value)}
    title={`${type} perception: ${value}`}
  />
);

export const MetaPill = ({ label, value }: { label: string; value: string }) => (
  <span className="inline-flex items-center rounded-full border border-slate/25 bg-paper/85 px-3 py-1 text-xs text-slate/70">
    <span className="font-semibold uppercase tracking-wide text-slate/50">{label}</span>
    <span className="ml-2 font-medium text-slate">{value}</span>
  </span>
);
