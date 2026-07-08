import posthog from 'posthog-js';

export function register() {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false,  // onRouteChange lida com isso
    capture_pageleave: true,
  });
}

export function onRouteChange({ url }: { url: string }) {
  posthog.capture('$pageview', { $current_url: url });
}
