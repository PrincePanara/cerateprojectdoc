import type { Project } from '../types/project';
import type { DocumentModel } from './documentModel';

function blocksToMarkdown(model: DocumentModel): string {
  const lines: string[] = [];
  model.nodes.forEach((n) => {
    if (n.key === 'cover') return;
    lines.push(`${n.level === 2 ? '###' : '##'} ${n.number ? `${n.number} ` : ''}${n.title}`, '');
    n.blocks.forEach((b) => {
      switch (b.kind) {
        case 'p':
          lines.push(b.text, '');
          break;
        case 'bullets':
          b.items.forEach((i) => lines.push(`- ${i}`));
          lines.push('');
          break;
        case 'numbers':
          b.items.forEach((i, idx) => lines.push(`${idx + 1}. ${i}`));
          lines.push('');
          break;
        case 'kv':
          b.rows.forEach(([k, v]) => lines.push(`- **${k}:** ${v}`));
          lines.push('');
          break;
        case 'table':
          lines.push(`**Table ${b.number}: ${b.caption}**`, '');
          lines.push(`| ${b.head.join(' | ')} |`);
          lines.push(`| ${b.head.map(() => '---').join(' | ')} |`);
          b.rows.forEach((r) => lines.push(`| ${r.map((c) => c.replace(/\|/g, '\\|')).join(' | ')} |`));
          lines.push('');
          break;
        case 'figure':
          if (b.imageUrl) lines.push(`![Figure ${b.number}: ${b.caption}](${b.imageUrl})`);
          lines.push(`*Figure ${b.number}: ${b.caption}*`, '');
          break;
        case 'toc':
          b.entries.forEach((e) => lines.push(`${e.level === 2 ? '  - ' : '- '}${e.text}`));
          lines.push('');
          break;
        case 'missing':
          lines.push(`> ${b.text}`, '');
          break;
      }
    });
  });
  return lines.join('\n');
}

export function toMarkdown(project: Project, model: DocumentModel): Blob {
  const header = `# ${project.basicInfo.projectName}\n\n${project.basicInfo.subtitle ? `_${project.basicInfo.subtitle}_\n\n` : ''}`;
  return new Blob([header + blocksToMarkdown(model)], { type: 'text/markdown' });
}

export function toHtml(project: Project, model: DocumentModel): Blob {
  const md = blocksToMarkdown(model);
  const escaped = md.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${project.basicInfo.projectName}</title><style>body{max-width:820px;margin:48px auto;font-family:Georgia,serif;line-height:1.7;padding:0 24px;color:#111}pre{white-space:pre-wrap;font-family:inherit}</style></head><body><h1>${project.basicInfo.projectName}</h1><pre>${escaped}</pre></body></html>`;
  return new Blob([html], { type: 'text/html' });
}

export function toJson(project: Project): Blob {
  return new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
}