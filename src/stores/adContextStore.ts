import { defaultAdContext } from '../mocks/ads'
import type { AdContext } from '../types/ad'

export type AdContextState = AdContext & {
  setAdContext: (context: AdContext) => void
}

export const initialAdContextState: AdContext = defaultAdContext

