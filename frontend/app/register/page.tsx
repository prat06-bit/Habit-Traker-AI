'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirm) {
      setError('Please fill all fields.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    if (typeof window === 'undefined') return;

    window.localStorage.setItem(
      'ai-habit-credentials',
      JSON.stringify({ email, password }),
    );
    window.localStorage.setItem('ai-habit-user', email);

    router.push('/dashboard');
  };

  return (
    <main className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-800/70 bg-slate-950/90 p-8 shadow-2xl shadow-emerald-400/30">
        <div className="absolute -top-10 left-1/2 h-16 w-16 -translate-x-1/2 rounded-2xl bg-gradient-to-br from-emerald-400 to-sky-400 shadow-lg shadow-emerald-400/50" />

        <h1 className="mt-6 text-center text-2xl font-semibold text-sky-100">
          Create your account
        </h1>
        <p className="mt-2 text-center text-xs text-slate-400">
          Sign up to start tracking your habits with AI.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-300">
              Email address
            </label>
            <input
              type="email"
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-400/70 focus:ring"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-400/70 focus:ring"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-300">
              Confirm password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 outline-none ring-emerald-400/70 focus:ring"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-xs font-semibold text-red-400">{error}</p>
          )}

          <button
            type="submit"
            className="mt-2 w-full rounded-full bg-emerald-400 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-400/60 transition hover:bg-emerald-300"
          >
            Create account
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-sky-300 hover:text-sky-200"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
