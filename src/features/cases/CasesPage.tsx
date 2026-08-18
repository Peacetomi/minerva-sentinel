import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EmptyState } from '../../components/EmptyState';
import { LiveRegion } from '../../components/LiveRegion';
import { Pagination } from '../../components/Pagination';
import { useAutoRefresh } from '../../hooks/useAutoRefresh';
import { useCases } from '../../hooks/useCases';
import { useFocusReturn } from '../../hooks/useFocusReturn';
import { useGlobalShortcut } from '../../hooks/useGlobalShortcut';
import { useUrlFilters } from '../../hooks/useUrlFilters';
import { activityService } from '../../services/activityService';
import { BulkToolbar } from '../bulk/BulkToolbar';
import { CaseDrawer } from '../drawer/CaseDrawer';
import { usePreferences } from '../preferences/PreferencesContext';
import { CommandPalette } from '../search/CommandPalette';
import { useSelection } from '../selection/SelectionContext';
import { SavedViewsMenu } from '../views/SavedViewsMenu';
import { CaseFiltersBar } from './CaseFiltersBar';
import { CaseTable } from './CaseTable';
import type { CaseRecord } from './types';

export function CasesPage() {
  const { filters, update } = useUrlFilters();
  const cases = useCases(filters);
  const selection = useSelection();
  const { preferences } = usePreferences();
  const [activeRecord, setActiveRecord] = useState<CaseRecord | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const { capture, restore } = useFocusReturn();
  const fallbackRef = useRef<HTMLButtonElement>(null);

  const active = useMemo(() => {
    if (!activeRecord) {
      return null;
    }

    return cases.records.find((record) => record.id === activeRecord.id) ?? activeRecord;
  }, [activeRecord, cases.records]);

  const openCase = useCallback(
    (record: CaseRecord, opener?: HTMLElement) => {
      if (opener) {
        capture(opener);
      }
      setActiveRecord(record);
    },
    [capture],
  );

  const closeDrawer = useCallback(() => {
    setActiveRecord(null);
    restore(fallbackRef.current);
  }, [restore]);

  useEffect(() => {
    if (!cases.loading) {
      selection.reconcile(cases.existingIds);
    }
  }, [cases.existingIds, cases.loading, selection.reconcile]);

  useAutoRefresh({
    enabled: preferences.autoRefresh,
    intervalMs: 30_000,
    refresh: cases.refresh,
  });

  useGlobalShortcut('k', () => setCommandOpen(true), { meta: true });
  useGlobalShortcut('r', () => void cases.refresh());

  return (
    <main className="workspace">
      <header className="topbar">
        <div>
          <p className="eyebrow">Investigation workspace</p>
          <h1>Cases</h1>
          <p>{cases.total} matching records</p>
        </div>
        <div className="top-actions">
          <SavedViewsMenu
            filters={filters}
            onApply={(view) => update({ ...view, page: 1 })}
          />
          <button
            ref={fallbackRef}
            onClick={() => void cases.refresh()}
            disabled={cases.refreshing}
          >
            {cases.refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </header>

      <CaseFiltersBar
        filters={filters}
        onChange={update}
        onCommand={() => setCommandOpen(true)}
      />

      <BulkToolbar
        onComplete={() => void cases.refresh()}
        onAnnounce={setAnnouncement}
      />

      {cases.error ? (
        <div role="alert" className="error">
          {cases.error}
          <button onClick={() => void cases.refresh()}>Retry</button>
        </div>
      ) : cases.loading ? (
        <div className="loading">Loading cases…</div>
      ) : cases.records.length ? (
        <>
          <CaseTable records={cases.records} onOpen={openCase} />
          <Pagination
            page={filters.page}
            pageSize={filters.pageSize}
            total={cases.total}
            onPage={(page) => update({ page }, { preservePage: true })}
            onPageSize={(pageSize) =>
              update({ pageSize, page: 1 }, { preservePage: true })
            }
          />
        </>
      ) : (
        <EmptyState
          title="No cases found"
          body="Adjust the filters or search query to broaden the result set."
        />
      )}

      <LiveRegion message={announcement} />

      <CaseDrawer
        record={active}
        onClose={closeDrawer}
        onSave={async (id, patch) => {
          const result = await cases.optimisticUpdate(id, patch);
          activityService.record(id, 'status', `Updated ${result.title}`);
          setActiveRecord(result);
          setAnnouncement(`${result.title} saved`);
          return result;
        }}
      />

      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onOpenCase={(record) => {
          setCommandOpen(false);
          openCase(record);
        }}
      />
    </main>
  );
}
