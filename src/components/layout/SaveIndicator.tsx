import React from 'react';
import { CheckIcon, CloudOffIcon, Loader2Icon, TriangleAlertIcon } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';
import { useProjects } from '../../contexts/ProjectsContext';

export function SaveIndicator() {
  const { saveState, lastSavedAt } = useProjects();

  if (saveState === 'offline')
  return (
    <span className="inline-flex items-center gap-1.5 text-[12.5px] text-warn">
        <CloudOffIcon className="w-3.5 h-3.5" aria-hidden /> Offline — changes will sync when connection returns
      </span>);

  if (saveState === 'error')
  return (
    <span className="inline-flex items-center gap-1.5 text-[12.5px] text-bad">
        <TriangleAlertIcon className="w-3.5 h-3.5" aria-hidden /> Could not save locally
      </span>);

  if (saveState === 'saving')
  return (
    <span className="inline-flex items-center gap-1.5 text-[12.5px] text-ink3">
        <Loader2Icon className="w-3.5 h-3.5 animate-spin" aria-hidden /> Saving…
      </span>);

  if (saveState === 'saved')
  return (
    <span className="inline-flex items-center gap-1.5 text-[12.5px] text-ink3">
        <CheckIcon className="w-3.5 h-3.5 text-ok" aria-hidden />
        {lastSavedAt && Date.now() - new Date(lastSavedAt).getTime() > 60_000 ?
      `Saved ${formatDistanceToNowStrict(new Date(lastSavedAt))} ago` :
      'Saved just now'}
      </span>);

  return null;
}