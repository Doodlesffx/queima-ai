'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

// Init é feito via instrumentation-client.ts — aqui só fornece o contexto React
export default function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
