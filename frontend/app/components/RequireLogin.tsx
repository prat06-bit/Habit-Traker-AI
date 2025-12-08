'use client';

import Link from 'next/link';

export default function RequireLogin() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center text-slate-200">
      <h2 className="text-xl font-semibold text-sky-100">
        Please sign in to use this feature
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-400">
        Create a free account to unlock your dashboard, history, and insights.
      </p>
      <div className="mt-4 flex gap-3">
        <Link
          href="/login"
          className="rounded-full bg-sky-500 px-5 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-sky-500/50 hover:bg-sky-400"
        >
          Sign in
        </Link>
        <Link
          href="/register"
          className="rounded-full border border-slate-600 px-5 py-2 text-sm font-semibold text-slate-100 hover:border-sky-400"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
