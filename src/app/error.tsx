'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10">
      <h2 className="text-xl font-bold text-red-600">Something went wrong!</h2>
      <p className="text-sm mt-2">{error.message}</p>
      <button onClick={() => reset()} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        Try again
      </button>
    </div>
  );
}
