import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { defaultAdContext } from '../mocks/ads'
import type { AdContext } from '../types/ad'

export type AdContextState = AdContext & {
  setAdContext: (context: AdContext) => void
}

export const useAdContextStore = create<AdContextState>()(
  persist(
    (set) => ({
      ...defaultAdContext,
      setAdContext: (context) => set(context),
    }),
    {
      name: 'commerce-feed-insight-ad-context',
    },
  ),
)

