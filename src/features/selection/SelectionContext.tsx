import { createContext, useContext, useMemo, useReducer } from 'react';
import { initialSelection, selectionReducer } from './selectionReducer';
const Context = createContext<ReturnType<typeof useSelectionValue> | null>(null);
function useSelectionValue() { const [state, dispatch] = useReducer(selectionReducer, initialSelection); return useMemo(() => ({ selectedIds: state.ids, toggle: (id: string) => dispatch({ type: 'toggle', id }), addMany: (ids: string[]) => dispatch({ type: 'addMany', ids }), removeMany: (ids: string[]) => dispatch({ type: 'removeMany', ids }), reconcile: (ids: string[]) => dispatch({ type: 'reconcile', existingIds: ids }), clear: () => dispatch({ type: 'clear' }) }), [state.ids]); }
export function SelectionProvider({ children }: {
    children: React.ReactNode;
}) { return <Context.Provider value={useSelectionValue()}>{children}</Context.Provider>; }
export function useSelection() { const value = useContext(Context); if (!value)
    throw new Error('SelectionProvider missing'); return value; }
