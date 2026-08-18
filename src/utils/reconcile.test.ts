import { describe, expect, it } from 'vitest';
import { seedCases } from '../features/cases/fixtures';
import { mergeRemoteWithDirtyDraft, overlayPatches, reconcileIds } from './reconcile';

describe('reconciliation utilities', () => {
  it('overlays optimistic patches in order', () => {
    const result = overlayPatches(seedCases[0], [
      { status: 'investigating' },
      { priority: 'critical' },
    ]);

    expect(result.status).toBe('investigating');
    expect(result.priority).toBe('critical');
  });

  it('lets the latest optimistic patch win for the same field', () => {
    const result = overlayPatches(seedCases[0], [
      { status: 'investigating' },
      { status: 'resolved' },
    ]);

    expect(result.status).toBe('resolved');
  });

  it('prunes selected IDs missing from the authoritative collection', () => {
    expect([...reconcileIds(['a', 'b', 'c'], ['b', 'c', 'd'])]).toEqual(['b', 'c']);
  });

  it('preserves dirty local fields while accepting clean remote fields', () => {
    const remote = { title: 'Remote title', status: 'resolved', owner: 'Mika' };
    const draft = { title: 'Local title', status: 'new', owner: 'Amina' };
    const result = mergeRemoteWithDirtyDraft(remote, draft, new Set(['title'] as const));

    expect(result).toEqual({ title: 'Local title', status: 'resolved', owner: 'Mika' });
  });
});
