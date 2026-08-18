import type { CaseFilters, CasePriority, CaseRecord } from '../features/cases/types';
const rank: Record<CasePriority, number> = { low: 1, medium: 2, high: 3, critical: 4 };
export function matchesCase(record: CaseRecord, filters: CaseFilters) {
    const q = filters.query.trim().toLowerCase();
    return (filters.status === 'all' || record.status === filters.status) && (filters.priority === 'all' || record.priority === filters.priority) && (!q || `${record.title} ${record.summary} ${record.assignee} ${record.tags.join(' ')}`.toLowerCase().includes(q));
}
export function compareCases(a: CaseRecord, b: CaseRecord, filters: CaseFilters) {
    let value = 0;
    if (filters.sort === 'priority')
        value = rank[a.priority] - rank[b.priority];
    else if (filters.sort === 'updatedAt')
        value = a.updatedAt.localeCompare(b.updatedAt);
    else
        value = String(a[filters.sort]).localeCompare(String(b[filters.sort]));
    if (value === 0)
        value = a.id.localeCompare(b.id);
    return filters.direction === 'asc' ? value : -value;
}
export function queryCases(records: CaseRecord[], filters: CaseFilters) {
    const filtered = records.filter(r => matchesCase(r, filters)).sort((a, b) => compareCases(a, b, filters));
    const start = (filters.page - 1) * filters.pageSize;
    return { records: filtered.slice(start, start + filters.pageSize), total: filtered.length, allIds: filtered.map(r => r.id) };
}
