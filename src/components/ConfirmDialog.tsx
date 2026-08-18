import { useEffect, useRef } from 'react';
export function ConfirmDialog({ open, title, body, confirmLabel = 'Confirm', onConfirm, onClose }: {
    open: boolean;
    title: string;
    body: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onClose: () => void;
}) { const cancelRef = useRef<HTMLButtonElement>(null); useEffect(() => { if (open)
    cancelRef.current?.focus(); }, [open]); useEffect(() => { if (!open)
    return; const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') {
    e.stopPropagation();
    onClose();
} }; window.addEventListener('keydown', onKey, true); return () => window.removeEventListener('keydown', onKey, true); }, [open, onClose]); if (!open)
    return null; return <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.currentTarget === e.target)
    onClose(); }}><div role="dialog" aria-modal="true" aria-labelledby="confirm-title" className="modal"><h2 id="confirm-title">{title}</h2><p>{body}</p><div className="actions"><button ref={cancelRef} onClick={onClose}>Cancel</button><button className="danger" onClick={onConfirm}>{confirmLabel}</button></div></div></div>; }
