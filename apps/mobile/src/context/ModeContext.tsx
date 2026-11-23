import { createContext, useContext, useState, ReactNode } from 'react';

export type AppMode = 'pedir' | 'dar';
type Ctx = { mode: AppMode; setMode: (m: AppMode) => void };
const ModeContext = createContext<Ctx>({ mode: 'pedir', setMode: () => {} });

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppMode>('pedir');
  return <ModeContext.Provider value={{ mode, setMode }}>{children}</ModeContext.Provider>;
}
export function useAppMode() { return useContext(ModeContext); }
