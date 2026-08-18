import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { initialSelection, selectionReducer } from './selectionReducer';

interface SelectionValue {
  selectedIds: Set<string>;
  toggle: (id: string) => void;
  addMany: (ids: string[]) => void;
  removeMany: (ids: string[]) => void;
  reconcile: (existingIds: string[]) => void;
  clear: () => void;
}

const Context = createContext<SelectionValue | null>(null);

function useSelectionValue(): SelectionValue {
  const [state, dispatch] = useReducer(selectionReducer, initialSelection);

  const toggle = useCallback((id: string) => dispatch({ type: 'toggle', id }), []);
  const addMany = useCallback((ids: string[]) => dispatch({ type: 'addMany', ids }), []);
  const removeMany = useCallback((ids: string[]) => dispatch({ type: 'removeMany', ids }), []);
  const reconcile = useCallback(
    (existingIds: string[]) => dispatch({ type: 'reconcile', existingIds }),
    [],
  );
  const clear = useCallback(() => dispatch({ type: 'clear' }), []);

  return useMemo(
    () => ({ selectedIds: state.ids, toggle, addMany, removeMany, reconcile, clear }),
    [state.ids, toggle, addMany, removeMany, reconcile, clear],
  );
}

export function SelectionProvider({ children }: { children: ReactNode }) {
  return <Context.Provider value={useSelectionValue()}>{children}</Context.Provider>;
}

export function useSelection() {
  const value = useContext(Context);
  if (!value) {
    throw new Error('SelectionProvider missing');
  }
  return value;
}
