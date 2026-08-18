import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { CaseFilters, CasePriority, CaseStatus, SortKey } from '../features/cases/types';
const defaults: CaseFilters = { query: '', status: 'all', priority: 'all', sort: 'updatedAt', direction: 'desc', page: 1, pageSize: 12 };
export function useUrlFilters() {
    const [params, setParams] = useSearchParams();
    const filters = useMemo<CaseFilters>(() => ({
        query: params.get('q') ?? '', status: (params.get('status') as CaseStatus | 'all') ?? 'all', priority: (params.get('priority') as CasePriority | 'all') ?? 'all', sort: (params.get('sort') as SortKey) ?? 'updatedAt', direction: params.get('dir') === 'asc' ? 'asc' : 'desc', page: Math.max(1, Number(params.get('page') ?? 1)), pageSize: [12, 24, 48].includes(Number(params.get('size'))) ? Number(params.get('size')) : 12
    }), [params]);
    const update = useCallback((patch: Partial<CaseFilters>, options?: {
        replace?: boolean;
        preservePage?: boolean;
    }) => setParams(current => { const next = new URLSearchParams(current); const merged = { ...filters, ...patch }; if (!options?.preservePage && Object.keys(patch).some(k => !['page', 'pageSize'].includes(k)))
        merged.page = 1; const mapping: {
        [K in keyof CaseFilters]: string;
    } = { query: 'q', status: 'status', priority: 'priority', sort: 'sort', direction: 'dir', page: 'page', pageSize: 'size' }; for (const [key, param] of Object.entries(mapping) as [
        keyof CaseFilters,
        string
    ][]) {
        const value = merged[key];
        const defaultValue = defaults[key];
        if (value === defaultValue || value === '')
            next.delete(param);
        else
            next.set(param, String(value));
    } return next; }, { replace: options?.replace }), [filters, setParams]);
    return { filters, update, defaults };
}
