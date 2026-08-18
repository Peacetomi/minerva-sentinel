import type { CasePatch, CaseRecord } from '../features/cases/types';

/** Applies pending optimistic layers in creation order over a server snapshot. */
export function overlayPatches(record: CaseRecord, patches: readonly CasePatch[]): CaseRecord {
  return patches.reduce<CaseRecord>(
    (current, patch) => ({
      ...current,
      ...patch,
    }),
    record,
  );
}

/** Retains only stable IDs that still exist in the authoritative collection. */
export function reconcileIds(selectedIds: Iterable<string>, existingIds: Iterable<string>) {
  const existing = new Set(existingIds);
  return new Set([...selectedIds].filter((id) => existing.has(id)));
}

/**
 * Merges a refreshed remote record into a local form draft while preserving
 * fields explicitly dirtied by the user. This utility is intentionally generic
 * enough for future drawer-refresh behavior without duplicating form state.
 */
export function mergeRemoteWithDirtyDraft<T extends object>(
  remote: T,
  draft: T,
  dirtyKeys: ReadonlySet<keyof T>,
): T {
  const next = { ...remote };

  for (const key of dirtyKeys) {
    next[key] = draft[key];
  }

  return next;
}
