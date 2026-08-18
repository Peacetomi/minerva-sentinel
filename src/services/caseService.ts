import { seedCases } from '../features/cases/fixtures';
import type { CaseFilters, CasePatch, CaseRecord } from '../features/cases/types';
import { queryCases } from '../utils/caseQuery';
import { scenarioController } from './scenarioController';
let records = structuredClone(seedCases);
let requestId = 0;
const copy = <T>(value: T): T => structuredClone(value);
export const caseService = {
    reset() { records = structuredClone(seedCases); requestId = 0; scenarioController.reset(); },
    async list(filters: CaseFilters, kind: 'list' | 'refresh' = 'list') { const id = ++requestId; await scenarioController.wait(kind, `${kind}:${id}`); return { ...queryCases(records, filters), requestId: id, records: copy(queryCases(records, filters).records) }; },
    async search(query: string) { const id = ++requestId; await scenarioController.wait('search', `search:${id}`); const q = query.trim().toLowerCase(); return { requestId: id, records: copy(records.filter(r => !q || `${r.title} ${r.assignee} ${r.id}`.toLowerCase().includes(q)).slice(0, 8)) }; },
    async get(id: string) { await scenarioController.wait('list', `get:${id}`); const found = records.find(r => r.id === id); return found ? copy(found) : null; },
    async update(id: string, patch: CasePatch) { await scenarioController.wait('update', `update:${id}`); const index = records.findIndex(r => r.id === id); if (index < 0)
        throw new Error('Case no longer exists'); records[index] = { ...records[index], ...copy(patch), updatedAt: new Date().toISOString(), version: records[index].version + 1 }; return copy(records[index]); },
    async bulk(ids: string[], patch: CasePatch) { const results: Record<string, {
        ok: true;
        record: CaseRecord;
    } | {
        ok: false;
        message: string;
    }> = {}; for (const id of ids) {
        try {
            await scenarioController.wait('bulk', `bulk:${id}`);
            results[id] = { ok: true, record: await caseService.update(id, patch) };
        }
        catch (e) {
            results[id] = { ok: false, message: e instanceof Error ? e.message : 'Failed' };
        }
    } return results; },
    remove(id: string) { records = records.filter(r => r.id !== id); }, snapshot() { return copy(records); }
};
