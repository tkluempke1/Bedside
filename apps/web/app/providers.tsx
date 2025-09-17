"use client";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

/**
 * Providers is a wrapper component that sets up React Query and any other
 * client-side context providers used by the Next.js app.  It's separated
 * into its own file so it can be imported by `layout.tsx` without
 * triggering React's client/server mismatch warnings.
 */
export default function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
