import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  EyeIcon,
  FileDownIcon,
  FileTextIcon,
  ImageIcon,
  LayersIcon,
  LayoutTemplateIcon,
  ListChecksIcon,
  MoonIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  SunIcon } from
'lucide-react';
import { Logo } from '../components/brand/Logo';
import { Button } from '../components/ui/Button';
import { HeroMock } from '../components/landing/HeroMock';
import { DOC_OUTLINE, FEATURES, STEPS } from '../data/landing';
import { TEMPLATES } from '../data/catalogs';
import { useTheme } from '../contexts/ThemeContext';

const ICONS: Record<string, React.ReactNode> = {
  sparkles: <SparklesIcon className="w-4 h-4" />,
  image: <ImageIcon className="w-4 h-4" />,
  listChecks: <ListChecksIcon className="w-4 h-4" />,
  layout: <LayoutTemplateIcon className="w-4 h-4" />,
  fileDown: <FileDownIcon className="w-4 h-4" />,
  layers: <LayersIcon className="w-4 h-4" />,
  eye: <EyeIcon className="w-4 h-4" />,
  sliders: <SlidersHorizontalIcon className="w-4 h-4" />
};

export function Landing() {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();

  return (
    <div className="min-h-full w-full bg-canvas">
      <header className="sticky top-0 z-40 bg-canvas/85 backdrop-blur border-b border-line2">
        <div className="mx-auto max-w-6xl px-5 h-14 flex items-center justify-between">
          <Link to="/" aria-label="DocuForge AI home">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-[13.5px] text-ink2" aria-label="Main">
            <a href="#features" className="hover:text-ink transition-colors duration-150 ease-out">Features</a>
            <a href="#how" className="hover:text-ink transition-colors duration-150 ease-out">How it works</a>
            <a href="#structure" className="hover:text-ink transition-colors duration-150 ease-out">Report structure</a>
            <a href="#templates" className="hover:text-ink transition-colors duration-150 ease-out">Templates</a>
          </nav>
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              className="w-8 h-8 rounded-lg border border-line text-ink2 hover:text-ink flex items-center justify-center transition-colors duration-150 ease-out">
              
              {theme === 'light' ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4" />}
            </button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/auth?mode=signin')}>
              Sign in
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate('/auth?mode=signup')}>
              Create Documentation
            </Button>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="mx-auto max-w-6xl px-5 pt-16 pb-14 lg:pt-24 lg:pb-20">
        <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-12 lg:gap-14 items-center">
          <div>
            <p className="text-[12.5px] font-medium text-brand mb-4">Build Your Project. Generate Your Documentation.</p>
            <h1 className="text-[34px] sm:text-[44px] lg:text-[52px] leading-[1.05] font-semibold tracking-[-0.025em] text-ink">
              Create professional project documentation in minutes
            </h1>
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink2 max-w-xl">
              Enter your project details, upload screenshots and diagrams, and let DocuForge AI generate a complete,
              professionally formatted project report — exported as a real Microsoft Word document.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Button size="lg" variant="primary" onClick={() => navigate('/auth?mode=signup')} icon={<ArrowRightIcon className="w-4 h-4 order-2" />}>
                Create Documentation
              </Button>
              <Button size="lg" onClick={() => navigate('/auth?mode=demo')}>
                View Demo
              </Button>
            </div>
            <dl className="mt-9 grid grid-cols-3 gap-6 max-w-md border-t border-line2 pt-6">
              {[
              ['10', 'Chapters generated'],
              ['.docx', 'Editable Word output'],
              ['4', 'Report templates']].
              map(([v, l]) =>
              <div key={l}>
                  <dt className="text-[19px] font-semibold text-ink tracking-[-0.01em]">{v}</dt>
                  <dd className="text-[12.5px] text-ink3 mt-0.5 leading-snug">{l}</dd>
                </div>
              )}
            </dl>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}>
            
            <HeroMock />
          </motion.div>
        </div>
      </section>

      {/* features */}
      <section id="features" className="border-t border-line2 bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="text-[26px] lg:text-[30px] font-semibold tracking-[-0.02em] text-ink">
              Everything a project report needs, handled for you
            </h2>
            <p className="mt-3 text-[14.5px] text-ink2 leading-relaxed">
              You provide the project information. DocuForge organises it, writes the explanations and produces the
              formatted document.
            </p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
            {FEATURES.map((f) =>
            <div key={f.title} className="flex flex-col">
                <span className="w-8 h-8 rounded-lg bg-brandSoft text-brand flex items-center justify-center" aria-hidden>
                  {ICONS[f.icon]}
                </span>
                <h3 className="mt-3.5 text-[14px] font-semibold text-ink">{f.title}</h3>
                <p className="mt-1.5 text-[13px] text-ink2 leading-relaxed">{f.body}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="border-t border-line2">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
          <h2 className="text-[26px] lg:text-[30px] font-semibold tracking-[-0.02em] text-ink">How it works</h2>
          <ol className="mt-10 grid md:grid-cols-4 gap-px bg-line rounded-xl overflow-hidden border border-line">
            {STEPS.map((s) =>
            <li key={s.number} className="bg-surface p-6">
                <span className="text-[12px] font-semibold text-brand tracking-[0.04em]">{s.number}</span>
                <h3 className="mt-2.5 text-[14.5px] font-semibold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-[13px] text-ink2 leading-relaxed">{s.body}</p>
              </li>
            )}
          </ol>
        </div>
      </section>

      {/* structure */}
      <section id="structure" className="border-t border-line2 bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:py-20 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-12 items-center">
          <div>
            <h2 className="text-[26px] lg:text-[30px] font-semibold tracking-[-0.02em] text-ink">
              A complete report structure, numbered automatically
            </h2>
            <p className="mt-3 text-[14.5px] text-ink2 leading-relaxed">
              Chapters, sections, figures and tables are numbered as you add content. The table of contents, list of
              figures and list of tables are built from the same structured data, so they never fall out of sync.
            </p>
            <ul className="mt-6 space-y-2.5">
              {[
              'Heading styles, page breaks and margins applied automatically',
              'Figure X.X captions generated from every screenshot and diagram',
              'Database and test case tables written as real Word tables',
              'Missing information flagged instead of invented'].
              map((t) =>
              <li key={t} className="flex gap-2.5 text-[13.5px] text-ink2">
                  <FileTextIcon className="w-4 h-4 text-brand shrink-0 mt-0.5" aria-hidden />
                  {t}
                </li>
              )}
            </ul>
          </div>
          <div className="rounded-xl border border-line bg-canvas p-5">
            <p className="text-[10.5px] font-semibold tracking-[0.08em] text-ink3 mb-3">DOCUMENT OUTLINE</p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
              {DOC_OUTLINE.map((s) =>
              <li key={s} className="text-[12.5px] text-ink2 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-ink3" aria-hidden />
                  {s}
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* templates */}
      <section id="templates" className="border-t border-line2">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
          <h2 className="text-[26px] lg:text-[30px] font-semibold tracking-[-0.02em] text-ink">Report templates</h2>
          <div className="mt-9 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TEMPLATES.map((t) =>
            <article key={t.id} className="rounded-xl border border-line bg-surface p-4 flex flex-col">
                <div className="aspect-[3/4] rounded-lg bg-white border border-line2 p-3.5 flex flex-col" aria-hidden>
                  <div className="h-1.5 w-1/2 bg-neutral-800 rounded-sm mx-auto" />
                  <div className="h-1 w-1/3 bg-neutral-300 rounded-sm mx-auto mt-1.5" />
                  <div className="mt-4 space-y-1">
                    {[95, 88, 92, 70, 96, 84].map((w, i) =>
                  <div key={i} className="h-[3px] bg-neutral-200 rounded-sm" style={{ width: `${w}%` }} />
                  )}
                  </div>
                  <div className="mt-auto h-6 border border-neutral-200 rounded-sm" />
                </div>
                <h3 className="mt-3.5 text-[13.5px] font-semibold text-ink">{t.name}</h3>
                <p className="mt-1 text-[12.5px] text-ink2 leading-relaxed">{t.description}</p>
              </article>
            )}
          </div>
        </div>
      </section>

      {/* cta */}
      <section className="border-t border-line2 bg-surface">
        <div className="mx-auto max-w-6xl px-5 py-16 text-center">
          <h2 className="text-[26px] lg:text-[30px] font-semibold tracking-[-0.02em] text-ink">
            From project idea to professional report
          </h2>
          <p className="mt-3 text-[14.5px] text-ink2 max-w-xl mx-auto leading-relaxed">
            Start with the sample project to see a finished report, or create your own and export it to Word.
          </p>
          <div className="mt-7 flex justify-center gap-3">
            <Button size="lg" variant="primary" onClick={() => navigate('/auth?mode=signup')}>
              Create Documentation
            </Button>
            <Button size="lg" onClick={() => navigate('/auth?mode=demo')}>
              View Demo
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-line2">
        <div className="mx-auto max-w-6xl px-5 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <div className="flex items-center gap-2 text-[13px] text-ink2">
            <span>Made with <span className="text-red-500">❤️</span> by</span>
            <a
              href="https://princepanara.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-medium text-ink hover:text-brand transition-colors"
            >
              <img src="/plogo.png" alt="Prince Panara" className="w-6 h-6 rounded-full object-cover border border-line shadow-sm" />
              <span>Prince Panara</span>
            </a>
          </div>
          <p className="text-[12.5px] text-ink3">© {new Date().getFullYear()} DocuForge AI</p>
        </div>
      </footer>
    </div>);

}