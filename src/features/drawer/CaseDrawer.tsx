import { useEffect, useRef, useState } from 'react';
import type { CasePatch, CaseRecord } from '../cases/types';
import { StatusPill } from '../../components/StatusPill';
import { CaseEditForm } from './CaseEditForm';
export function CaseDrawer({ record, onClose, onSave }: {
    record: CaseRecord | null;
    onClose: () => void;
    onSave: (id: string, patch: CasePatch) => Promise<CaseRecord>;
}) { const closeRef = useRef<HTMLButtonElement>(null); const [saving, setSaving] = useState(false); useEffect(() => { if (record)
    closeRef.current?.focus(); }, [record?.id]); useEffect(() => { if (!record)
    return; const listener = (e: KeyboardEvent) => { if (e.key === 'Escape') {
    e.preventDefault();
    onClose();
} }; window.addEventListener('keydown', listener); return () => window.removeEventListener('keydown', listener); }, [record, onClose]); if (!record)
    return null; return <aside className="drawer" role="dialog" aria-modal="false" aria-labelledby="drawer-title"><header><div><small>{record.id}</small><h2 id="drawer-title">{record.title}</h2></div><button ref={closeRef} aria-label="Close case details" onClick={onClose}>×</button></header><div className="drawer-meta"><StatusPill value={record.status}/><StatusPill value={record.priority}/><span>{record.assignee}</span></div><CaseEditForm record={record} saving={saving} onSave={async (patch) => { setSaving(true); try {
    await onSave(record.id, patch);
}
finally {
    setSaving(false);
} }}/></aside>; }
