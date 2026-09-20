import React from 'react';
import { CheckIcon, FileDownIcon, ImageIcon, SparklesIcon } from 'lucide-react';

const SIDEBAR = [
{ label: 'Cover Page', done: true },
{ label: 'Abstract', done: true },
{ label: 'Ch 1 — Introduction', done: true },
{ label: 'Ch 2 — System Analysis', done: true },
{ label: 'Ch 3 — System Design', done: false, active: true },
{ label: 'Ch 4 — Technology Stack', done: false },
{ label: 'Ch 5 — System Modules', done: false },
{ label: 'Ch 6 — System Screens', done: false }];


export function HeroMock() {
  return (
    <div className="rounded-xl border border-line bg-surface shadow-pop overflow-hidden">
      {/* window chrome */}
      <div className="h-10 px-3.5 flex items-center justify-between border-b border-line2 bg-surface2">
        <div className="flex items-center gap-1.5" aria-hidden>
          <span className="w-2.5 h-2.5 rounded-full bg-line" />
          <span className="w-2.5 h-2.5 rounded-full bg-line" />
          <span className="w-2.5 h-2.5 rounded-full bg-line" />
        </div>
        <span className="text-[11.5px] text-ink3 font-medium">Qubeso Exam Portal — Documentation</span>
        <span className="inline-flex items-center gap-1.5 h-6 px-2 rounded-md bg-brand text-white text-[11px] font-medium">
          <FileDownIcon className="w-3 h-3" aria-hidden /> Export DOCX
        </span>
      </div>

      <div className="grid grid-cols-[168px_1fr] lg:grid-cols-[168px_1fr_196px] min-h-[340px]">
        {/* project sidebar */}
        <aside className="border-r border-line2 p-3 bg-surface2/50">
          <p className="text-[10px] font-semibold tracking-[0.08em] text-ink3 mb-2">DOCUMENT</p>
          <ul className="space-y-0.5">
            {SIDEBAR.map((s) =>
            <li
              key={s.label}
              className={`flex items-center gap-1.5 px-1.5 py-[5px] rounded text-[11px] ${
              s.active ? 'bg-brandSoft text-brandInk font-medium' : 'text-ink2'}`
              }>
              
                {s.done ?
              <CheckIcon className="w-3 h-3 text-ok shrink-0" aria-hidden /> :

              <span className="w-3 h-3 rounded-full border border-line shrink-0" aria-hidden />
              }
                <span className="truncate">{s.label}</span>
              </li>
            )}
          </ul>
        </aside>

        {/* page preview */}
        <div className="p-4 bg-canvas">
          <div className="mx-auto max-w-[300px] bg-white text-black rounded-sm shadow-page p-5 font-serif">
            <p className="text-[9px] tracking-[0.12em] text-neutral-500 text-center">CHAPTER 3</p>
            <p className="text-[12px] font-semibold text-center mt-0.5">SYSTEM DESIGN</p>
            <p className="text-[9px] font-semibold mt-3">3.1 System Architecture</p>
            <div className="mt-1.5 space-y-[3px]" aria-hidden>
              {[100, 96, 99, 88].map((w, i) =>
              <div key={i} className="h-[3px] rounded-sm bg-neutral-200" style={{ width: `${w}%` }} />
              )}
            </div>
            <div className="mt-3 border border-neutral-200 rounded-sm h-16 flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-neutral-300" aria-hidden />
            </div>
            <p className="text-[7.5px] text-center italic text-neutral-500 mt-1">Figure 3.1: System Architecture Diagram</p>
            <div className="mt-3 space-y-[3px]" aria-hidden>
              {[100, 92].map((w, i) =>
              <div key={i} className="h-[3px] rounded-sm bg-neutral-200" style={{ width: `${w}%` }} />
              )}
            </div>
            <p className="text-[7.5px] text-center text-neutral-400 mt-4">18</p>
          </div>
        </div>

        {/* AI panel */}
        <aside className="hidden lg:block border-l border-line2 p-3">
          <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.08em] text-ink3 mb-2">
            <SparklesIcon className="w-3 h-3 text-brand" aria-hidden /> AI ASSISTANT
          </p>
          <div className="rounded-lg border border-line bg-surface2 p-2.5">
            <p className="text-[10.5px] text-ink2 leading-relaxed">
              The portal follows a client and cloud backend architecture. The React client communicates directly with Firebase services…
            </p>
          </div>
          <div className="flex gap-1.5 mt-2">
            <span className="h-6 px-2 rounded-md bg-brand text-white text-[10px] font-medium inline-flex items-center">Accept</span>
            <span className="h-6 px-2 rounded-md border border-line text-ink2 text-[10px] font-medium inline-flex items-center">Edit</span>
            <span className="h-6 px-2 rounded-md border border-line text-ink2 text-[10px] font-medium inline-flex items-center">Retry</span>
          </div>
          <p className="text-[9.5px] text-ink3 mt-3 leading-relaxed">
            Sources: Technology stack · Modules
          </p>
        </aside>
      </div>
    </div>);

}