import type { CasePriority, CaseRecord, CaseStatus } from './types';
const statuses: CaseStatus[] = ['new', 'investigating', 'blocked', 'resolved'];
const priorities: CasePriority[] = ['low', 'medium', 'high', 'critical'];
const teams = ['Amina Okafor', 'Jon Bell', 'Mika Chen', 'Priya Shah', 'Theo Martin', 'Unassigned'];
const topics = ['Payment review', 'Identity mismatch', 'Account takeover', 'Merchant dispute', 'Policy escalation', 'Document verification', 'Refund anomaly', 'Access review'];
export const seedCases: CaseRecord[] = Array.from({ length: 72 }, (_, i) => ({
    id: `case-${String(i + 1).padStart(3, '0')}`,
    title: `${topics[i % topics.length]} #${i + 1}`,
    summary: `Investigation record ${i + 1} requires coordinated review across evidence, ownership, and customer impact.`,
    status: statuses[i % statuses.length], priority: priorities[(i * 3) % priorities.length], assignee: teams[i % teams.length],
    tags: [`queue-${(i % 4) + 1}`, i % 3 === 0 ? 'watch' : 'routine'], updatedAt: new Date(Date.UTC(2026, 6, 28) - i * 36e5 * 7).toISOString(), version: 1, score: 100 - (i % 37)
}));
