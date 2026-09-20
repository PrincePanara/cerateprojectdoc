import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  HeadingLevel,
  ImageRun,
  PageBreak,
  PageNumber,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TableOfContents,
  TextRun,
  WidthType,
  convertInchesToTwip } from
'docx';
import type { Project } from '../types/project';
import type { Block, DocNode, DocumentModel } from './documentModel';

const PAGE_SIZES = {
  A4: { width: 11906, height: 16838 },
  Letter: { width: 12240, height: 15840 }
};

const MARGINS: Record<string, number> = {
  Normal: convertInchesToTwip(1),
  Narrow: convertInchesToTwip(0.5),
  Wide: convertInchesToTwip(1.25)
};

interface LoadedImage {
  data: Uint8Array;
  width: number;
  height: number;
}

async function loadImage(url: string): Promise<LoadedImage | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    const buffer = new Uint8Array(await blob.arrayBuffer());
    let width = 520;
    let height = 320;
    try {
      const bitmap = await createImageBitmap(blob);
      const ratio = bitmap.height / bitmap.width;
      width = 520;
      height = Math.round(520 * ratio);
      bitmap.close?.();
    } catch {

      /* keep fallback dimensions */}
    return { data: buffer, width, height };
  } catch {
    return null;
  }
}

export interface DocxProgress {
  (step: string, percent: number): void;
}

export async function buildDocx(project: Project, model: DocumentModel, onProgress?: DocxProgress): Promise<Blob> {
  const f = project.formatting;
  const half = (pt: number) => pt * 2;
  const lineRule = Math.round(240 * f.lineSpacing);
  const bodyAlign =
  f.alignment === 'center' ? AlignmentType.CENTER : f.alignment === 'left' ? AlignmentType.LEFT : AlignmentType.JUSTIFIED;

  onProgress?.('Preparing document structure', 10);

  // Pre-load every image once.
  const imageUrls = new Set<string>();
  model.nodes.forEach((n) =>
  n.blocks.forEach((b) => {
    if (b.kind === 'figure' && b.imageUrl) imageUrls.add(b.imageUrl);
  })
  );
  if (project.basicInfo.collegeLogo) imageUrls.add(project.basicInfo.collegeLogo);

  const images = new Map<string, LoadedImage>();
  let loaded = 0;
  for (const url of imageUrls) {
    const img = await loadImage(url);
    if (img) images.set(url, img);
    loaded += 1;
    onProgress?.('Embedding images', 10 + Math.round(loaded / Math.max(1, imageUrls.size) * 45));
  }

  onProgress?.('Applying formatting rules', 62);

  const body = (text: string, opts: {align?: (typeof AlignmentType)[keyof typeof AlignmentType];italics?: boolean;bold?: boolean;size?: number;spacingAfter?: number;} = {}) =>
  new Paragraph({
    alignment: opts.align ?? bodyAlign,
    spacing: { line: lineRule, after: opts.spacingAfter ?? 140 },
    children: [new TextRun({ text, font: f.font, size: half(opts.size ?? f.bodySize), italics: opts.italics, bold: opts.bold })]
  });

  const caption = (text: string) =>
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 80, after: 220 },
    keepLines: true,
    children: [new TextRun({ text, font: f.font, size: half(Math.max(9, f.bodySize - 1)), italics: true })]
  });

  function tableOf(head: string[], rows: string[][]): Table {
    const border = { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' };
    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: { top: border, bottom: border, left: border, right: border, insideHorizontal: border, insideVertical: border },
      rows: [
      new TableRow({
        tableHeader: true,
        children: head.map(
          (h) =>
          new TableCell({
            shading: { fill: 'F2F2F2' },
            margins: { top: 80, bottom: 80, left: 120, right: 120 },
            children: [
            new Paragraph({
              spacing: { line: 240 },
              children: [new TextRun({ text: h, bold: true, font: f.font, size: half(Math.max(9, f.bodySize - 1)) })]
            })]

          })
        )
      }),
      ...rows.map(
        (r) =>
        new TableRow({
          children: r.map(
            (cell) =>
            new TableCell({
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [
              new Paragraph({
                spacing: { line: 240 },
                children: [new TextRun({ text: cell || '—', font: f.font, size: half(Math.max(9, f.bodySize - 1)) })]
              })]

            })
          )
        })
      )]

    });
  }

  function coverParagraphs(): Paragraph[] {
    const bi = project.basicInfo;
    const center = (text: string, size: number, bold = false, after = 160) =>
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after, line: 240 },
      children: [new TextRun({ text, font: f.font, size: half(size), bold })]
    });
    const out: Paragraph[] = [];
    const logo = bi.collegeLogo ? images.get(bi.collegeLogo) : null;
    if (logo) {
      out.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
          children: [new ImageRun({ data: logo.data, transformation: { width: 90, height: Math.round(90 * logo.height / logo.width) } })]
        })
      );
    }
    out.push(center(bi.universityName || '', f.bodySize + 1, true, 60));
    out.push(center(bi.collegeName || '', f.bodySize, false, 420));
    out.push(center('A PROJECT REPORT ON', f.bodySize, false, 200));
    out.push(center(bi.projectName || 'Untitled Project', f.h1Size + 4, true, 100));
    if (bi.subtitle) out.push(center(bi.subtitle, f.bodySize + 1, false, 360));
    out.push(center(`Submitted in partial fulfilment of the requirements for the ${bi.projectType}`, f.bodySize, false, 420));
    out.push(center('SUBMITTED BY', f.bodySize, true, 120));
    const members = bi.teamMembers.length ? bi.teamMembers : [{ id: 'x', name: bi.studentName, enrollment: bi.enrollmentNumber }];
    members.filter((m) => m.name).forEach((m) => out.push(center(`${m.name}${m.enrollment ? ` (${m.enrollment})` : ''}`, f.bodySize + 1, false, 60)));
    out.push(new Paragraph({ spacing: { after: 320 }, children: [] }));
    if (bi.guideName) {
      out.push(center('UNDER THE GUIDANCE OF', f.bodySize, true, 120));
      out.push(center(bi.guideName, f.bodySize + 1, false, 360));
    }
    out.push(center(bi.department || '', f.bodySize, true, 60));
    out.push(center(bi.academicYear || '', f.bodySize, false, 60));
    return out;
  }

  async function renderBlock(block: Block): Promise<(Paragraph | Table)[]> {
    switch (block.kind) {
      case 'p':
        return [
        body(block.text, {
          align:
          block.align === 'center' ? AlignmentType.CENTER : block.align === 'left' ? AlignmentType.LEFT : undefined
        })];

      case 'bullets':
        return block.items.map(
          (item) =>
          new Paragraph({
            bullet: { level: 0 },
            spacing: { line: lineRule, after: 80 },
            children: [new TextRun({ text: item, font: f.font, size: half(f.bodySize) })]
          })
        );
      case 'numbers':
        return block.items.map(
          (item, i) =>
          new Paragraph({
            spacing: { line: lineRule, after: 80 },
            indent: { left: 360, hanging: 360 },
            children: [new TextRun({ text: `[${i + 1}] ${item}`, font: f.font, size: half(f.bodySize) })]
          })
        );
      case 'kv':
        return [
        tableOf(['Field', 'Value'], block.rows.map(([k, v]) => [k, v])),
        new Paragraph({ spacing: { after: 200 }, children: [] })];

      case 'table':
        return [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          keepNext: true,
          spacing: { before: 120, after: 80 },
          children: [new TextRun({ text: `Table ${block.number}: ${block.caption}`, font: f.font, size: half(Math.max(9, f.bodySize - 1)), italics: true })]
        }),
        tableOf(block.head, block.rows),
        new Paragraph({ spacing: { after: 220 }, children: [] })];

      case 'figure':{
          const img = block.imageUrl ? images.get(block.imageUrl) : null;
          const out: (Paragraph | Table)[] = [];
          if (img) {
            out.push(
              new Paragraph({
                alignment: AlignmentType.CENTER,
                keepNext: true,
                spacing: { before: 180, after: 40 },
                children: [new ImageRun({ data: img.data, transformation: { width: img.width, height: img.height } })]
              })
            );
          } else {
            out.push(
              new Paragraph({
                alignment: AlignmentType.CENTER,
                keepNext: true,
                spacing: { before: 180, after: 40 },
                children: [new TextRun({ text: '[ Image could not be embedded ]', font: f.font, size: half(f.bodySize), italics: true, color: '999999' })]
              })
            );
          }
          out.push(caption(`Figure ${block.number}: ${block.caption}`));
          if (block.note) out.push(body(block.note));
          return out;
        }
      case 'missing':
        return [body(`[ ${block.text} ]`, { italics: true })];
      case 'toc':
        return block.entries.map(
          (e) =>
          new Paragraph({
            spacing: { line: 240, after: 60 },
            indent: { left: e.level === 2 ? 480 : 0 },
            children: [new TextRun({ text: e.text, font: f.font, size: half(f.bodySize), bold: e.level === 1 })]
          })
        );
      case 'cover':
        return coverParagraphs();
      default:
        return [];
    }
  }

  async function renderNode(node: DocNode, index: number): Promise<(Paragraph | Table)[]> {
    const out: (Paragraph | Table)[] = [];
    if (node.pageBreak && index > 0) out.push(new Paragraph({ children: [new PageBreak()] }));

    if (node.key !== 'cover') {
      const isChapter = node.level === 1;
      const isFront = node.level === 0;
      out.push(
        new Paragraph({
          heading: isChapter || isFront ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
          alignment: isFront || isChapter ? AlignmentType.CENTER : AlignmentType.LEFT,
          keepNext: true,
          spacing: { before: isChapter || isFront ? 240 : 280, after: 160 },
          children: [
          new TextRun({
            text: isChapter ? `CHAPTER ${node.number}` : isFront ? node.title.toUpperCase() : `${node.number} ${node.title}`,
            bold: true,
            font: f.font,
            size: half(isChapter || isFront ? f.h1Size : f.h2Size)
          })]

        })
      );
      if (isChapter) {
        out.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            keepNext: true,
            spacing: { after: 280 },
            children: [new TextRun({ text: node.title.toUpperCase(), bold: true, font: f.font, size: half(f.h1Size) })]
          })
        );
      }
    }

    if (node.key === 'toc') {
      out.push(new TableOfContents('Contents', { hyperlink: true, headingStyleRange: '1-3' }));
      out.push(body('(Right-click and choose "Update Field" in Word to refresh page numbers.)', { italics: true, align: AlignmentType.LEFT }));
    }

    for (const block of node.blocks) {
      out.push(...(await renderBlock(block)));
    }
    return out;
  }

  const children: (Paragraph | Table)[] = [];
  for (let i = 0; i < model.nodes.length; i += 1) {
    children.push(...(await renderNode(model.nodes[i], i)));
    onProgress?.('Writing sections', 62 + Math.round((i + 1) / model.nodes.length * 28));
  }

  const pageNumberAlignment =
  f.pageNumbers === 'Bottom Right' || f.pageNumbers === 'Top Right' ? AlignmentType.RIGHT : AlignmentType.CENTER;

  const numberParagraph = new Paragraph({
    alignment: pageNumberAlignment,
    children: [new TextRun({ children: [PageNumber.CURRENT], font: f.font, size: half(Math.max(9, f.bodySize - 2)) })]
  });

  const headerChildren: Paragraph[] = [];
  if (f.headerText) {
    headerChildren.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD', space: 4 } },
        children: [new TextRun({ text: f.headerText, font: f.font, size: half(Math.max(9, f.bodySize - 2)) })]
      })
    );
  }
  if (f.pageNumbers === 'Top Right') headerChildren.push(numberParagraph);

  const footerChildren: Paragraph[] = [];
  if (f.footerText) {
    footerChildren.push(
      new Paragraph({
        alignment: AlignmentType.LEFT,
        children: [new TextRun({ text: f.footerText, font: f.font, size: half(Math.max(9, f.bodySize - 2)) })]
      })
    );
  }
  if (f.pageNumbers === 'Bottom Center' || f.pageNumbers === 'Bottom Right') footerChildren.push(numberParagraph);

  const doc = new Document({
    creator: project.basicInfo.studentName || 'DocuForge AI',
    title: project.basicInfo.projectName,
    description: project.basicInfo.subtitle,
    styles: {
      default: {
        document: { run: { font: f.font, size: half(f.bodySize) }, paragraph: { spacing: { line: lineRule } } },
        heading1: { run: { font: f.font, size: half(f.h1Size), bold: true, color: '000000' }, paragraph: { spacing: { before: 240, after: 160 }, keepNext: true } },
        heading2: { run: { font: f.font, size: half(f.h2Size), bold: true, color: '000000' }, paragraph: { spacing: { before: 240, after: 140 }, keepNext: true } },
        heading3: { run: { font: f.font, size: half(f.h3Size), bold: true, color: '000000' }, paragraph: { spacing: { before: 200, after: 120 }, keepNext: true } }
      }
    },
    sections: [
    {
      properties: {
        page: {
          size: PAGE_SIZES[f.pageSize],
          margin: {
            top: MARGINS[f.margins] ?? MARGINS.Normal,
            bottom: MARGINS[f.margins] ?? MARGINS.Normal,
            left: MARGINS[f.margins] ?? MARGINS.Normal,
            right: MARGINS[f.margins] ?? MARGINS.Normal
          }
        }
      },
      headers: headerChildren.length ? { default: new Header({ children: headerChildren }) } : undefined,
      footers: footerChildren.length ? { default: new Footer({ children: footerChildren }) } : undefined,
      children
    }]

  });

  onProgress?.('Packaging Word document', 95);
  const blob = await Packer.toBlob(doc);
  onProgress?.('Done', 100);
  return blob;
}

export function docxFileName(project: Project): string {
  const safe = (project.basicInfo.projectName || 'Untitled_Project').replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '');
  return `${safe}_Project_Documentation.docx`;
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}