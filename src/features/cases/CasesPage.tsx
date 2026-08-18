import { useCallback, useMemo, useRef, useState } from 'react';
import { EmptyState } from '../../components/EmptyState';
import { LiveRegion } from '../../components/LiveRegion';
import { Pagination } from '../../components/Pagination';
import { useCases } from '../../hooks/useCases';
import { useFocusReturn } from '../../hooks/useFocusReturn';
import { useGlobalShortcut } from '../../hooks/useGlobalShortcut';
import { activityService } from '../../services/activityService';
import { BulkToolbar } from '../bulk/BulkToolbar';
import { CaseDrawer } from '../drawer/CaseDrawer';
import { CommandPalette } from '../search/CommandPalette';
import { useSelection } from '../selection/SelectionContext';
import { SavedViewsMenu } from '../views/SavedViewsMenu';
import { CaseFiltersBar } from './CaseFiltersBar';
import { CaseTable } from './CaseTable';
import type { CaseRecord } from './types';
import { useUrlFilters } from '../../hooks/useUrlFilters';
export function CasesPage() { const { filters, update } = useUrlFilters(); const cases = useCases(filters); const selection = useSelection(); const [activeId, setActiveId] = useState<string | null>(null); const [commandOpen, setCommandOpen] = useState(false); const [announcement, setAnnouncement] = useState(''); const { capture, restore } = useFocusReturn(); const fallbackRef = useRef<HTMLButtonElement>(null); const active = useMemo(() => activeId ? cases.records.find(r => r.id === activeId) ?? null : null, [activeId, cases.records]); const openCase = useCallback((record: CaseRecord, opener?: HTMLElement) => { if (opener)
    capture(opener); setActiveId(record.id); }, [capture]); const closeDrawer = useCallback(() => { setActiveId(null); restore(fallbackRef.current); }, [restore]); useGlobalShortcut('k', () => setCommandOpen(true), { meta: true }); useGlobalShortcut('r', () => void cases.refresh()); return <main className="workspace"><header className="topbar"><div><p className="eyebrow">Investigation workspace</p><h1>Cases</h1><p>{cases.total} matching records</p></div><div className="top-actions"><SavedViewsMenu filters={filters} onApply={view => update({ ...view, page: 1 })}/><button ref={fallbackRef} onClick={() => void cases.refresh()} disabled={cases.refreshing}>{cases.refreshing ? 'Refreshing…' : 'Refresh'}</button></div></header><CaseFiltersBar filters={filters} onChange={update} onCommand={() => setCommandOpen(true)}/><BulkToolbar onComplete={() => void cases.refresh()} onAnnounce={setAnnouncement}/>{cases.error ? <div role="alert" className="error">{cases.error}<button onClick={() => void cases.refresh()}>Retry</button></div> : cases.loading ? <div className="loading">Loading cases…</div> : cases.records.length ? <><CaseTable records={cases.records} onOpen={openCase}/><Pagination page={filters.page} pageSize={filters.pageSize} total={cases.total} onPage={page => update({ page }, { preservePage: true })} onPageSize={pageSize => update({ pageSize, page: 1 }, { preservePage: true })}/></> : <EmptyState title="No cases found" body="Adjust the filters or search query to broaden the result set."/>}<LiveRegion message={announcement}/><CaseDrawer record={active} onClose={closeDrawer} onSave={async (id, patch) => { const result = await cases.optimisticUpdate(id, patch); activityService.record(id, 'status', `Updated ${result.title}`); setAnnouncement(`${result.title} saved`); return result; }}/><CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} onOpenCase={record => { setCommandOpen(false); update({ query: '', page: 1 }); openCase(record); }}/></main>; }
