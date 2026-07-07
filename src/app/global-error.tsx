'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body style={{ background: '#0D0D0D', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'sans-serif', flexDirection: 'column', gap: '16px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Algo deu errado</h2>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Nosso time já foi notificado. Tente novamente.</p>
        <button
          onClick={reset}
          style={{ background: '#00AEEF', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', cursor: 'pointer', fontWeight: '600' }}
        >
          Tentar novamente
        </button>
      </body>
    </html>
  );
}
