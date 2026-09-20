import React, { useRef, useState } from 'react';
import { UploadCloudIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

interface UploadZoneProps {
  onFiles: (files: {name: string;dataUrl: string;}[]) => void;
  multiple?: boolean;
  label?: string;
  hint?: string;
  compact?: boolean;
}

export function UploadZone({ onFiles, multiple = true, label = 'Drop images here or click to browse', hint = 'JPG, PNG or WEBP · up to 5 MB each', compact = false }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handle = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setError(null);
    const files = Array.from(fileList);
    const invalid = files.find((f) => !ACCEPTED.includes(f.type));
    if (invalid) {
      setError(`${invalid.name} is not a supported image type.`);
      return;
    }
    const tooBig = files.find((f) => f.size > MAX_BYTES);
    if (tooBig) {
      setError(`${tooBig.name} is larger than the 5 MB limit.`);
      return;
    }
    setBusy(true);
    const read = (file: File) =>
    new Promise<{name: string;dataUrl: string;}>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name.replace(/\.[^.]+$/, ''), dataUrl: String(reader.result) });
      reader.onerror = () => reject(new Error('read failed'));
      reader.readAsDataURL(file);
    });
    try {
      const results = await Promise.all(files.map(read));
      onFiles(results);
    } catch {
      setError('One of the files could not be read. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handle(e.dataTransfer.files);
        }}
        className={cn(
          'w-full flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed transition-colors duration-150 ease-out',
          compact ? 'py-5 px-4' : 'py-10 px-6',
          dragging ? 'border-brand bg-brandSoft' : 'border-line bg-surface2/70 hover:border-ink3/60'
        )}>
        
        <UploadCloudIcon className={cn('text-ink3', dragging && 'text-brand', compact ? 'w-5 h-5' : 'w-6 h-6')} aria-hidden />
        <span className="text-[13px] font-medium text-ink">{busy ? 'Reading files…' : label}</span>
        <span className="text-[12px] text-ink3">{hint}</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => {
          void handle(e.target.files);
          e.target.value = '';
        }} />
      
      {error && <p className="text-[12px] text-bad mt-1.5">{error}</p>}
    </div>);

}