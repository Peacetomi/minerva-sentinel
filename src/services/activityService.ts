export interface ActivityItem {
    id: string;
    caseId: string;
    kind: 'note' | 'status' | 'assignment';
    message: string;
    createdAt: string;
}
let items: ActivityItem[] = [];
export const activityService = { record(caseId: string, kind: ActivityItem['kind'], message: string) { items.unshift({ id: `activity-${items.length + 1}`, caseId, kind, message, createdAt: new Date().toISOString() }); }, list(caseId?: string) { return items.filter(i => !caseId || i.caseId === caseId); }, reset() { items = []; } };
