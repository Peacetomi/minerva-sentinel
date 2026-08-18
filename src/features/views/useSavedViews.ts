import { useCallback, useEffect, useState } from 'react';
import type { CaseFilters } from '../cases/types';
import { loadViews, saveViews, type SavedView } from './viewStorage';
export function useSavedViews() { const [views, setViews] = useState<SavedView[]>(loadViews); useEffect(() => saveViews(views), [views]); const add = useCallback((name: string, filters: CaseFilters) => { const { page: _page, ...savedFilters } = filters; void _page; setViews(v => [...v, { id: crypto.randomUUID(), name, filters: savedFilters, createdAt: new Date().toISOString() }]); }, []); const remove = useCallback((id: string) => setViews(v => v.filter(x => x.id !== id)), []); return { views, add, remove }; }
