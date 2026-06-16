import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'rose' | 'white' | 'slate';
}

const sizeMap = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
const colorMap = {
  rose: 'border-rose-500 border-t-transparent',
  white: 'border-white border-t-transparent',
  slate: 'border-slate-400 border-t-transparent',
};

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'rose' }) => (
  <div
    className={`rounded-full border-2 animate-spin ${sizeMap[size]} ${colorMap[color]}`}
    role="status"
    aria-label="Memuat..."
  />
);

export const PageSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-[300px]">
    <div className="flex flex-col items-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-slate-500 animate-pulse">Memuat data...</p>
    </div>
  </div>
);

export default Spinner;
