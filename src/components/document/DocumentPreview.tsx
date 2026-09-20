import React from 'react';
import type { Project } from '../../types/project';
import type { Block, DocNode, DocumentModel } from '../../utils/documentModel';

const FONT_STACKS: Record<string, string> = {
  'Times New Roman': '"Times New Roman", Times, serif',
  Arial: 'Arial, Helvetica, sans-serif',
  Calibri: 'Calibri, "Segoe UI", sans-serif',
  Georgia: 'Georgia, "Source Serif 4", serif'
};

const MARGIN_IN: Record<string, number> = { Normal: 1, Narrow: 0.5, Wide: 1.25 };

function CoverPage({ project }: {project: Project;}) {
  const b = project.basicInfo;
  const members = b.teamMembers.length ? b.teamMembers : [{ id: 'x', name: b.studentName, enrollment: b.enrollmentNumber }];
  return (
    <div className="text-center">
      {b.collegeLogo && <img src={b.collegeLogo} alt="" className="w-20 h-20 object-contain mx-auto mb-4" />}
      <p className="font-bold">{b.universityName || '[University Name]'}</p>
      <p className="mt-1">{b.collegeName || '[College Name]'}</p>
      <p className="mt-10">A PROJECT REPORT ON</p>
      <p className="text-[1.6em] font-bold mt-3 leading-snug">{b.projectName || 'Untitled Project'}</p>
      {b.subtitle && <p className="mt-2 italic">{b.subtitle}</p>}
      <p className="mt-10">Submitted in partial fulfilment of the requirements for the {b.projectType}</p>
      <p className="mt-10 font-bold">SUBMITTED BY</p>
      {members.
      filter((m) => m.name).
      map((m) =>
      <p key={m.id} className="mt-1">
            {m.name}
            {m.enrollment ? ` (${m.enrollment})` : ''}
          </p>
      )}
      {b.guideName &&
      <>
          <p className="mt-10 font-bold">UNDER THE GUIDANCE OF</p>
          <p className="mt-1">{b.guideName}</p>
        </>
      }
      <p className="mt-10 font-bold">{b.department || '[Department]'}</p>
      <p className="mt-1">{b.academicYear || '[Academic Year]'}</p>
    </div>);

}

function BlockView({ block, project, align }: {block: Block;project: Project;align: string;}) {
  switch (block.kind) {
    case 'p':
      return <p style={{ textAlign: (block.align ?? align) as 'left' }} className="mb-3">{block.text}</p>;
    case 'bullets':
      return (
        <ul className="list-disc pl-6 mb-3 space-y-1">
          {block.items.map((i, idx) =>
          <li key={idx}>{i}</li>
          )}
        </ul>);

    case 'numbers':
      return (
        <ol className="pl-6 mb-3 space-y-1">
          {block.items.map((i, idx) =>
          <li key={idx}>[{idx + 1}] {i}</li>
          )}
        </ol>);

    case 'kv':
      return (
        <table className="w-full border-collapse mb-4 text-[0.92em]">
          <tbody>
            {block.rows.map(([k, v]) =>
            <tr key={k}>
                <th className="border border-neutral-400 px-2 py-1 text-left font-semibold w-1/3 bg-neutral-100">{k}</th>
                <td className="border border-neutral-400 px-2 py-1">{v}</td>
              </tr>
            )}
          </tbody>
        </table>);

    case 'table':
      return (
        <figure className="mb-4">
          <figcaption className="text-center italic text-[0.88em] mb-1.5">
            Table {block.number}: {block.caption}
          </figcaption>
          <table className="w-full border-collapse text-[0.86em]">
            <thead>
              <tr>
                {block.head.map((h) =>
                <th key={h} className="border border-neutral-400 px-2 py-1 text-left font-semibold bg-neutral-100">
                    {h}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) =>
              <tr key={i}>
                  {row.map((cell, j) =>
                <td key={j} className="border border-neutral-400 px-2 py-1 align-top">
                      {cell || '—'}
                    </td>
                )}
                </tr>
              )}
            </tbody>
          </table>
        </figure>);

    case 'figure':
      return (
        <figure className="mb-4 mt-3">
          {block.imageUrl ?
          <img src={block.imageUrl} alt={block.caption} className="max-w-[86%] mx-auto border border-neutral-200" loading="lazy" /> :

          <div className="h-28 border border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 text-[0.85em]">
              Image not attached
            </div>
          }
          <figcaption className="text-center italic text-[0.88em] mt-1.5">
            Figure {block.number}: {block.caption}
          </figcaption>
          {block.note && <p className="mt-2" style={{ textAlign: align as 'left' }}>{block.note}</p>}
        </figure>);

    case 'missing':
      return (
        <p className="mb-3 italic text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1.5 rounded-sm text-[0.9em]">
          [ {block.text} ]
        </p>);

    case 'toc':
      return (
        <ul className="mb-3">
          {block.entries.map((e, i) =>
          <li key={i} className={e.level === 2 ? 'pl-6' : 'font-semibold'}>
              {e.text}
            </li>
          )}
        </ul>);

    case 'cover':
      return <CoverPage project={project} />;
    default:
      return null;
  }
}

function Page({
  nodes,
  project,
  pageNumber,
  id





}: {nodes: DocNode[];project: Project;pageNumber: number;id: string;}) {
  const f = project.formatting;
  const isA4 = f.pageSize === 'A4';
  const width = isA4 ? 794 : 816;
  const minHeight = isA4 ? 1123 : 1056;
  const margin = (MARGIN_IN[f.margins] ?? 1) * 96;

  return (
    <article
      id={id}
      className="bg-white text-black shadow-page mx-auto relative"
      style={{
        width,
        minHeight,
        padding: margin,
        fontFamily: FONT_STACKS[f.font],
        fontSize: `${f.bodySize}pt`,
        lineHeight: f.lineSpacing
      }}>
      
      {f.headerText &&
      <div className="absolute left-0 right-0 text-[0.78em] text-neutral-500 border-b border-neutral-200 pb-1" style={{ top: margin / 2, left: margin, right: margin }}>
          {f.headerText}
        </div>
      }

      {nodes.map((node) =>
      <section key={node.key} id={`sec-${node.key}`} className="scroll-mt-24">
          {node.key !== 'cover' &&
        <>
              {node.level === 1 ?
          <header className="text-center mb-5">
                  <h2 style={{ fontSize: `${f.h1Size}pt` }} className="font-bold">
                    CHAPTER {node.number}
                  </h2>
                  <h3 style={{ fontSize: `${f.h1Size}pt` }} className="font-bold mt-1">
                    {node.title.toUpperCase()}
                  </h3>
                </header> :
          node.level === 0 ?
          <h2 style={{ fontSize: `${f.h1Size}pt` }} className="font-bold text-center mb-5">
                  {node.title.toUpperCase()}
                </h2> :

          <h3 style={{ fontSize: `${f.h2Size}pt` }} className="font-bold mt-4 mb-2">
                  {node.number} {node.title}
                </h3>
          }
            </>
        }
          {node.blocks.map((block, i) =>
        <BlockView key={i} block={block} project={project} align={f.alignment} />
        )}
        </section>
      )}

      {f.pageNumbers !== 'None' &&
      <div
        className="absolute text-[0.78em] text-neutral-500"
        style={{
          bottom: margin / 2,
          left: margin,
          right: margin,
          textAlign: f.pageNumbers === 'Bottom Right' ? 'right' : f.pageNumbers === 'Top Right' ? 'right' : 'center'
        }}>
        
          {f.footerText && <span className="float-left">{f.footerText}</span>}
          {pageNumber}
        </div>
      }
    </article>);

}

export function DocumentPreview({ project, model }: {project: Project;model: DocumentModel;}) {
  // group nodes into pages: a node with pageBreak starts a new page
  const pages: DocNode[][] = [];
  model.nodes.forEach((node) => {
    if (node.pageBreak || pages.length === 0) pages.push([node]);else
    pages[pages.length - 1].push(node);
  });

  return (
    <div className="flex flex-col gap-6 items-center py-2">
      {pages.map((nodes, i) =>
      <Page key={nodes[0].key} id={`page-${nodes[0].key}`} nodes={nodes} project={project} pageNumber={i + 1} />
      )}
    </div>);

}