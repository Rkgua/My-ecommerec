'use client';

import { SessionProvider } from 'next-auth/react';

export function CartProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
