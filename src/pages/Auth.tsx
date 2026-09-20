import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertTriangleIcon, ArrowLeftIcon } from 'lucide-react';
import { Logo } from '../components/brand/Logo';
import { Button } from '../components/ui/Button';
import { Field } from '../components/ui/Field';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';

export function Auth() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, signUp, signInWithGoogle, user } = useAuth();
  const initialMode = params.get('mode') === 'signup' ? 'signup' : 'signin';
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/app', { replace: true });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'signup') await signUp(name, email, password);else
      await signIn(email, password);
      navigate('/app', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const demo = async () => {
    setError(null);
    setLoading(true);
    try {
      await signIn('aarav.mehta@college.edu', 'demo1234');
      navigate('/app', { replace: true });
    } catch {
      setError('Could not open the demo workspace.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full w-full bg-canvas grid lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <div className="flex items-center justify-between">
          <Link to="/" aria-label="DocuForge AI home">
            <Logo />
          </Link>
          <Link to="/" className="text-[13px] text-ink2 hover:text-ink inline-flex items-center gap-1.5 transition-colors duration-150 ease-out">
            <ArrowLeftIcon className="w-3.5 h-3.5" /> Back
          </Link>
        </div>

        <div className="flex-1 flex items-center">
          <div className="w-full max-w-sm mx-auto py-12">
            <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-ink">
              {mode === 'signup' ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="mt-1.5 text-[13.5px] text-ink2">
              {mode === 'signup' ?
              'Start building your first project documentation.' :
              'Sign in to continue building your documentation.'}
            </p>

            <form onSubmit={submit} className="mt-7 flex flex-col gap-4" noValidate>
              {mode === 'signup' &&
              <Field label="Full name" htmlFor="name" required>
                  <Input id="name" value={name} autoComplete="name" onChange={(e) => setName(e.target.value)} placeholder="Aarav Mehta" />
                </Field>
              }
              <Field label="Email address" htmlFor="email" required>
                <Input id="email" type="email" value={email} autoComplete="email" onChange={(e) => setEmail(e.target.value)} placeholder="you@college.edu" />
              </Field>
              <Field label="Password" htmlFor="password" required hint="At least 6 characters.">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" />
                
              </Field>

              {error &&
              <p role="alert" className="flex items-start gap-2 text-[12.5px] text-bad bg-badSoft border border-bad/20 rounded-lg px-3 py-2">
                  <AlertTriangleIcon className="w-4 h-4 shrink-0 mt-px" /> {error}
                </p>
              }

              <Button type="submit" variant="primary" size="lg" loading={loading} className="mt-1">
                {mode === 'signup' ? 'Create account' : 'Sign in'}
              </Button>
            </form>

            <div className="flex items-center gap-3 my-5">
              <span className="h-px flex-1 bg-line2" />
              <span className="text-[11.5px] text-ink3">or</span>
              <span className="h-px flex-1 bg-line2" />
            </div>

            <div className="flex flex-col gap-2">
              <Button
                size="lg"
                onClick={async () => {
                  setLoading(true);
                  await signInWithGoogle();
                  setLoading(false);
                  navigate('/app', { replace: true });
                }}>
                
                Continue with Google
              </Button>
              <Button size="lg" variant="ghost" onClick={demo}>
                Open the demo workspace
              </Button>
            </div>

            <p className="mt-6 text-[13px] text-ink2 text-center">
              {mode === 'signup' ? 'Already have an account?' : 'New to DocuForge AI?'}{' '}
              <button
                onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                className="text-brand font-medium hover:text-brandInk transition-colors duration-150 ease-out">
                
                {mode === 'signup' ? 'Sign in' : 'Create an account'}
              </button>
            </p>
          </div>
        </div>
      </div>

      <aside className="hidden lg:flex flex-col justify-center border-l border-line2 bg-surface px-14">
        <blockquote className="max-w-md">
          <p className="text-[19px] leading-relaxed text-ink font-serif">
            “The report used to take three weeks of formatting. Now the writing is the only part left to do.”
          </p>
          <footer className="mt-5 text-[13px] text-ink2">
            Final year project guide · Department of Computer Engineering
          </footer>
        </blockquote>
        <ul className="mt-12 space-y-3 border-t border-line2 pt-8 max-w-md">
          {[
          'Structured project data, never raw AI text',
          'Real editable .docx with automatic numbering',
          'Missing information is flagged, not invented'].
          map((t) =>
          <li key={t} className="text-[13.5px] text-ink2 flex gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand mt-[7px] shrink-0" aria-hidden />
              {t}
            </li>
          )}
        </ul>
      </aside>
    </div>);

}