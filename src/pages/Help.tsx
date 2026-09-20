import React from 'react';
import { Panel } from '../components/ui/Panel';

const FAQ = [
{
  q: 'How does the document get generated?',
  a: 'Everything you enter is stored as structured project data. When you export, that data is validated, passed through the selected template and formatting rules, and written into a real .docx file. AI text is never written straight into the document — it is always reviewed and accepted by you first.'
},
{
  q: 'Can I open the file in Google Docs or LibreOffice?',
  a: 'Yes. The export is a standard Office Open XML document, so Microsoft Word, Google Docs and LibreOffice all open and edit it.'
},
{
  q: 'Why does a section say "Information required"?',
  a: 'The AI assistant will not invent technical facts. If a section depends on information you have not provided — for example the authentication method — the report marks it as required instead of guessing.'
},
{
  q: 'How are figures and tables numbered?',
  a: 'Numbering is derived from the chapter each item belongs to. Screenshots become Figure 6.x, design diagrams become Figure 3.x, and every table is numbered within its chapter. The list of figures and list of tables are generated from the same data.'
},
{
  q: 'Is my work saved automatically?',
  a: 'Yes. Changes are saved a moment after you stop typing. If you lose connection the status shows "Offline" and your changes sync as soon as the connection returns.'
}];


export function Help() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <header>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">Help</h1>
        <p className="text-[13.5px] text-ink2 mt-1">How DocuForge AI builds your report.</p>
      </header>

      <Panel title="Frequently asked questions">
        <dl className="divide-y divide-line2">
          {FAQ.map((item) =>
          <div key={item.q} className="py-3.5 first:pt-0 last:pb-0">
              <dt className="text-[13.5px] font-medium text-ink">{item.q}</dt>
              <dd className="text-[13px] text-ink2 mt-1.5 leading-relaxed">{item.a}</dd>
            </div>
          )}
        </dl>
      </Panel>

      <Panel title="The generation pipeline" description="Nothing goes into the document that is not structured data first.">
        <ol className="flex flex-col gap-2.5">
          {[
          'User input',
          'Structured project data',
          'Validation',
          'AI content generation',
          'Content review and acceptance',
          'Document template',
          'Formatting engine',
          'DOCX generator',
          'Final document'].
          map((s, i) =>
          <li key={s} className="flex items-center gap-3 text-[13px] text-ink2">
              <span className="w-6 h-6 rounded-md bg-surface2 border border-line text-[11px] font-medium text-ink3 flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              {s}
            </li>
          )}
        </ol>
      </Panel>
    </div>);

}