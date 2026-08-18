import { useCallback, useRef } from 'react';
export function useFocusReturn() { const opener = useRef<HTMLElement | null>(null); const capture = useCallback((element: HTMLElement | null) => { opener.current = element; }, []); const restore = useCallback((fallback?: HTMLElement | null) => { queueMicrotask(() => { if (opener.current?.isConnected)
    opener.current.focus();
else
    fallback?.focus(); }); }, []); return { capture, restore }; }
