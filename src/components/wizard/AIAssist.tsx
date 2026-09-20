import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, InfoIcon, PencilIcon, RefreshCwIcon, SparklesIcon, XIcon } from 'lucide-react';
import type { Project } from '../../types/project';
import { AI_ACTION_LABELS, runAI, type AIAction, type AITaskId } from '../../utils/ai';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';

interface AIAssistProps {
  task: AITaskId;
  project: Project;
  current?: string;
  args?: Record<string, string>;
  onAccept: (text: string) => void;
  /** actions offered beyond Generate */
  actions?: AIAction[];
  label?: string;
  compact?: boolean;
}

export function AIAssist({
  task,
  project,
  current,
  args,
  onAccept,
  actions = ['improve', 'expand', 'shorten', 'professional', 'grammar'],
  label = 'Generate with AI',
  compact = false
}: AIAssistProps) {
  const [loading, setLoading] = useState<AIAction | null>(null);
  const [result, setResult] = useState<{text: string;sources: string[];} | null>(null);
  const [missing, setMissing] = useState<string[] | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [error, setError] = useState<string | null>(null);

  const run = async (action: AIAction) => {
    setLoading(action);
    setError(null);
    setMissing(null);
    try {
      const res = await runAI({ task, project, action, current, args });
      if (res.status === 'missing') {
        setMissing(res.missing);
        setResult(null);
      } else {
        setResult({ text: res.text, sources: res.sources });
        setDraft(res.text);
        setEditing(false);
      }
    } catch {
      setError('The assistant could not complete that request.');
    } finally {
      setLoading(null);
    }
  };

  const available = AI_ACTION_LABELS.filter((a) => a.id === 'generate' || actions.includes(a.id)).filter(
    (a) => a.id === 'generate' || (current || '').trim().length > 0
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-1.5">
        {available.map((a) =>
        <Button
          key={a.id}
          type="button"
          size="sm"
          variant={a.id === 'generate' ? 'subtle' : 'ghost'}
          loading={loading === a.id}
          disabled={!!loading}
          onClick={() => run(a.id)}
          icon={a.id === 'generate' ? <SparklesIcon className="w-3.5 h-3.5" /> : undefined}>
          
            {a.id === 'generate' ? compact ? 'AI' : label : a.label}
          </Button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {missing &&
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-lg border border-warn/30 bg-warnSoft px-3 py-2.5">
          
            <p className="text-[12.5px] font-medium text-warn flex items-center gap-1.5">
              <InfoIcon className="w-3.5 h-3.5" aria-hidden /> Information required
            </p>
            <p className="text-[12.5px] text-ink2 mt-1 leading-relaxed">
              The assistant will not invent these details. Add them first and try again:
            </p>
            <ul className="mt-1.5 space-y-0.5">
              {missing.map((m) =>
            <li key={m} className="text-[12.5px] text-ink2">
                  · {m}
                </li>
            )}
            </ul>
          </motion.div>
        }

        {error &&
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-[12.5px] text-bad"
          role="alert">
          
            {error}{' '}
            <button className="underline" onClick={() => run('generate')}>
              Try again
            </button>
          </motion.p>
        }

        {result &&
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-lg border border-brand/30 bg-brandSoft/60 p-3">
          
            <p className="text-[11px] font-semibold tracking-[0.06em] text-brandInk mb-2">GENERATED CONTENT</p>
            {editing ?
          <Textarea value={draft} rows={6} onChange={(e) => setDraft(e.target.value)} /> :

          <p className="text-[13px] text-ink leading-relaxed whitespace-pre-wrap">{draft}</p>
          }
            <p className="text-[11.5px] text-ink3 mt-2">Based on: {result.sources.join(' · ')}</p>
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              <Button
              size="sm"
              variant="primary"
              icon={<CheckIcon className="w-3.5 h-3.5" />}
              onClick={() => {
                onAccept(draft);
                setResult(null);
              }}>
              
                Accept
              </Button>
              <Button size="sm" icon={<PencilIcon className="w-3.5 h-3.5" />} onClick={() => setEditing((e) => !e)}>
                {editing ? 'Done editing' : 'Edit'}
              </Button>
              <Button size="sm" variant="ghost" icon={<RefreshCwIcon className="w-3.5 h-3.5" />} loading={loading === 'generate'} onClick={() => run('generate')}>
                Regenerate
              </Button>
              <Button size="sm" variant="ghost" icon={<XIcon className="w-3.5 h-3.5" />} onClick={() => setResult(null)}>
                Discard
              </Button>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}