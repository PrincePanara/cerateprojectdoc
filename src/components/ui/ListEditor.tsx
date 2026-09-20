import React, { useState } from 'react';
import { PlusIcon, XIcon } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';

interface ListEditorProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  emptyLabel?: string;
  suggestions?: string[];
}

export function ListEditor({ items, onChange, placeholder = 'Add an item…', emptyLabel, suggestions = [] }: ListEditorProps) {
  const [draft, setDraft] = useState('');

  const add = (value: string) => {
    const v = value.trim();
    if (!v || items.includes(v)) return;
    onChange([...items, v]);
    setDraft('');
  };

  return (
    <div className="flex flex-col gap-2">
      {items.length > 0 ?
      <ul className="flex flex-col gap-1.5">
          {items.map((item, i) =>
        <li key={`${item}-${i}`} className="group flex items-start gap-2 rounded-lg border border-line bg-surface px-2.5 py-1.5">
              <span className="text-[11px] text-ink3 font-mono pt-[3px] w-5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-[13px] text-ink flex-1 leading-relaxed">{item}</span>
              <button
            type="button"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            aria-label={`Remove ${item}`}
            className="text-ink3 hover:text-bad transition-colors duration-150 ease-out mt-0.5">
            
                <XIcon className="w-3.5 h-3.5" />
              </button>
            </li>
        )}
        </ul> :

      emptyLabel && <p className="text-[12.5px] text-ink3">{emptyLabel}</p>
      }

      <div className="flex gap-2">
        <Input
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add(draft);
            }
          }} />
        
        <Button type="button" icon={<PlusIcon className="w-4 h-4" />} onClick={() => add(draft)}>
          Add
        </Button>
      </div>

      {suggestions.filter((s) => !items.includes(s)).length > 0 &&
      <div className="flex flex-wrap gap-1.5 pt-0.5">
          {suggestions.
        filter((s) => !items.includes(s)).
        slice(0, 8).
        map((s) =>
        <button
          key={s}
          type="button"
          onClick={() => add(s)}
          className="h-6 px-2 rounded-md border border-line bg-surface2 text-[12px] text-ink2 hover:border-brand hover:text-brand transition-colors duration-150 ease-out">
          
                + {s}
              </button>
        )}
        </div>
      }
    </div>);

}