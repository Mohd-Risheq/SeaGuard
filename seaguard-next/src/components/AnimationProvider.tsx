'use client';

import { useGsapAnimations } from '@/hooks/useGsapAnimations';

export default function AnimationProvider({ children }: { children: React.ReactNode }) {
  useGsapAnimations();
  return <>{children}</>;
}
