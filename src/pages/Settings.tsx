import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { Input } from '../components/ui/Input';
import { Panel } from '../components/ui/Panel';
import { Select } from '../components/ui/Select';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useToast } from '../components/ui/ToastProvider';
import { DEFAULT_FORMATTING } from '../data/emptyProject';

const PREF_KEY = 'docuforge.docPrefs';

export function Settings() {
  const { user, updateProfile } = useAuth();
  const { theme, toggle } = useTheme();
  const { push } = useToast();
  const [name, setName] = useState(user?.name ?? '');
  const [college, setCollege] = useState(user?.college ?? '');
  const [department, setDepartment] = useState(user?.department ?? '');
  const [prefs, setPrefs] = useState(() => {
    try {
      const raw = window.localStorage.getItem(PREF_KEY);
      return raw ? JSON.parse(raw) as typeof DEFAULT_FORMATTING : DEFAULT_FORMATTING;
    } catch {
      return DEFAULT_FORMATTING;
    }
  });

  const saveProfile = () => {
    updateProfile({ name, college, department });
    push({ tone: 'success', title: 'Profile updated' });
  };

  const savePrefs = () => {
    window.localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
    push({ tone: 'success', title: 'Document preferences saved', description: 'New projects will start with these settings.' });
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <header>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">Settings</h1>
        <p className="text-[13.5px] text-ink2 mt-1">Your profile and the defaults applied to new documents.</p>
      </header>

      <Panel title="Profile" actions={<Button size="sm" variant="primary" onClick={saveProfile}>Save</Button>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full name" htmlFor="s-name">
            <Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Email address" htmlFor="s-email" hint="Email cannot be changed in this workspace.">
            <Input id="s-email" value={user?.email ?? ''} disabled />
          </Field>
          <Field label="College" htmlFor="s-college">
            <Input id="s-college" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="Sardar Vallabhbhai Institute of Technology" />
          </Field>
          <Field label="Department" htmlFor="s-dept">
            <Input id="s-dept" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Computer Engineering" />
          </Field>
        </div>
      </Panel>

      <Panel title="Default document preferences" description="Applied to every new project you create." actions={<Button size="sm" variant="primary" onClick={savePrefs}>Save defaults</Button>}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Font" htmlFor="s-font">
            <Select
              id="s-font"
              options={['Times New Roman', 'Arial', 'Calibri', 'Georgia']}
              value={prefs.font}
              onChange={(e) => setPrefs({ ...prefs, font: e.target.value as typeof prefs.font })} />
            
          </Field>
          <Field label="Body size" htmlFor="s-size">
            <Select
              id="s-size"
              options={['10', '11', '12', '13', '14']}
              value={String(prefs.bodySize)}
              onChange={(e) => setPrefs({ ...prefs, bodySize: Number(e.target.value) })} />
            
          </Field>
          <Field label="Line spacing" htmlFor="s-spacing">
            <Select
              id="s-spacing"
              options={['1', '1.15', '1.5', '2']}
              value={String(prefs.lineSpacing)}
              onChange={(e) => setPrefs({ ...prefs, lineSpacing: Number(e.target.value) as typeof prefs.lineSpacing })} />
            
          </Field>
          <Field label="Page size" htmlFor="s-page">
            <Select
              id="s-page"
              options={['A4', 'Letter']}
              value={prefs.pageSize}
              onChange={(e) => setPrefs({ ...prefs, pageSize: e.target.value as typeof prefs.pageSize })} />
            
          </Field>
        </div>
      </Panel>

      <Panel title="Appearance">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13.5px] text-ink">Theme</p>
            <p className="text-[12.5px] text-ink2 mt-0.5">Currently using {theme} mode.</p>
          </div>
          <Button onClick={toggle}>Switch to {theme === 'light' ? 'dark' : 'light'} mode</Button>
        </div>
      </Panel>
    </div>);

}