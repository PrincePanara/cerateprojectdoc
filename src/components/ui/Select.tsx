import React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: (string | {value: string;label: string;})[];
}

export function Select({ options, className, ...rest }: SelectProps) {
  return (
    <div className="relative">
      <select
        {...rest}
        className={cn(
          'w-full h-9 pl-3 pr-8 rounded-lg bg-surface border border-line text-[13.5px] text-ink appearance-none transition-colors duration-150 ease-out hover:border-ink3/60 focus:border-brand focus:ring-0',
          className
        )}>
        
        {options.map((o) => {
          const value = typeof o === 'string' ? o : o.value;
          const label = typeof o === 'string' ? o : o.label;
          return (
            <option key={value} value={value}>
              {label}
            </option>);

        })}
      </select>
      <ChevronDownIcon className="w-4 h-4 text-ink3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden />
    </div>);

}