import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AlertTriangleIcon, ArrowLeftIcon } from 'lucide-react';
import { Logo } from '../components/brand/Logo';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

export function Auth() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { signInWithGoogle, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const nextRoute = params.get('next') || '/app';

  useEffect(() => {
    if (user) navigate(nextRoute, { replace: true });
  }, [user, navigate, nextRoute]);

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
              Welcome to DocuForge AI
            </h1>
            <p className="mt-1.5 text-[13.5px] text-ink2">
              Sign in or create an account to start building your documentation.
            </p>

            <div className="mt-10 flex flex-col gap-4">
              {error && (
                <p role="alert" className="flex items-start gap-2 text-[12.5px] text-bad bg-badSoft border border-bad/20 rounded-lg px-3 py-2">
                  <AlertTriangleIcon className="w-4 h-4 shrink-0 mt-px" /> {error}
                </p>
              )}

              <Button
                size="lg"
                variant="primary"
                loading={loading}
                onClick={async () => {
                  setError(null);
                  setLoading(true);
                  try {
                    await signInWithGoogle();
                  } catch (err: any) {
                    let msg = err instanceof Error ? err.message : 'Failed to sign in with Google.';
                    if (msg.includes('auth/popup-closed-by-user')) msg = 'Sign-in popup was closed before completing.';
                    else if (msg.includes('auth/cancelled-popup-request')) msg = 'Sign-in popup was cancelled.';
                    else if (msg.includes('auth/unauthorized-domain')) msg = 'This domain is not authorized for Google Sign-In. Please add it in the Firebase Console.';
                    setError(msg);
                    setLoading(false);
                  }
                }}>
                Continue with Google
              </Button>
            </div>
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
    </div>
  );
}