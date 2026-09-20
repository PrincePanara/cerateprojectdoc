import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOutIcon, MoonIcon, SettingsIcon, SunIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (!user) return null;
  const initials = user.name.
  split(' ').
  map((p) => p[0]).
  slice(0, 2).
  join('').
  toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 h-8 pl-1 pr-2 rounded-lg hover:bg-surface2 transition-colors duration-150 ease-out">
        
        <span className="w-6 h-6 rounded-md bg-brand text-white text-[11px] font-semibold flex items-center justify-center">
          {initials}
        </span>
        <span className="hidden sm:block text-[13px] text-ink max-w-[120px] truncate">{user.name}</span>
      </button>

      {open &&
      <div
        role="menu"
        className="absolute right-0 mt-1.5 w-56 bg-surface border border-line rounded-lg shadow-pop p-1 z-50">
        
          <div className="px-2.5 py-2 border-b border-line2 mb-1">
            <p className="text-[13px] font-medium text-ink truncate">{user.name}</p>
            <p className="text-[12px] text-ink3 truncate">{user.email}</p>
          </div>
          <button
          role="menuitem"
          onClick={() => {
            setOpen(false);
            navigate('/app/settings');
          }}
          className="w-full flex items-center gap-2 px-2.5 h-8 rounded-md text-[13px] text-ink2 hover:bg-surface2 hover:text-ink transition-colors duration-150 ease-out">
          
            <SettingsIcon className="w-4 h-4" /> Profile & settings
          </button>
          <button
          role="menuitem"
          onClick={toggle}
          className="w-full flex items-center gap-2 px-2.5 h-8 rounded-md text-[13px] text-ink2 hover:bg-surface2 hover:text-ink transition-colors duration-150 ease-out">
          
            {theme === 'light' ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4" />}
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
          <button
          role="menuitem"
          onClick={() => {
            signOut();
            navigate('/');
          }}
          className="w-full flex items-center gap-2 px-2.5 h-8 rounded-md text-[13px] text-ink2 hover:bg-surface2 hover:text-ink transition-colors duration-150 ease-out">
          
            <LogOutIcon className="w-4 h-4" /> Sign out
          </button>
        </div>
      }
    </div>);

}