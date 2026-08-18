import { useEffect } from 'react';
import { isEditableTarget } from '../utils/editableTarget';
export function useGlobalShortcut(key: string, handler: () => void, options: {
    meta?: boolean;
    allowEditable?: boolean;
} = {}) { useEffect(() => { const onKey = (event: KeyboardEvent) => { if (event.key.toLowerCase() !== key.toLowerCase())
    return; if (options.meta && !(event.metaKey || event.ctrlKey))
    return; if (!options.allowEditable && isEditableTarget(event.target))
    return; event.preventDefault(); handler(); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [handler, key, options.allowEditable, options.meta]); }
