/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo } from 'react';
import { usePersistedState } from '../../hooks/usePersistedState';
import { defaultPreferences, type Preferences } from './preferences';
const Context = createContext<{
    preferences: Preferences;
    setPreferences: React.Dispatch<React.SetStateAction<Preferences>>;
} | null>(null);
export function PreferencesProvider({ children }: {
    children: React.ReactNode;
}) { const [preferences, setPreferences] = usePersistedState('sentinel.preferences', defaultPreferences); const value = useMemo(() => ({ preferences, setPreferences }), [preferences, setPreferences]); return <Context.Provider value={value}>{children}</Context.Provider>; }
export function usePreferences() { const value = useContext(Context); if (!value)
    throw new Error('PreferencesProvider missing'); return value; }
