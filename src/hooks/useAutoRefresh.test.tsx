import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAutoRefresh } from './useAutoRefresh';

describe('useAutoRefresh', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not schedule refreshes when disabled', () => {
    const refresh = vi.fn();
    renderHook(() => useAutoRefresh({ enabled: false, intervalMs: 1000, refresh }));
    act(() => vi.advanceTimersByTime(5000));
    expect(refresh).not.toHaveBeenCalled();
  });

  it('refreshes at the configured interval', () => {
    const refresh = vi.fn();
    renderHook(() => useAutoRefresh({ enabled: true, intervalMs: 1000, refresh }));
    act(() => vi.advanceTimersByTime(3100));
    expect(refresh).toHaveBeenCalledTimes(3);
  });

  it('uses the latest callback without duplicating the timer', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = renderHook(
      ({ refresh }) => useAutoRefresh({ enabled: true, intervalMs: 1000, refresh }),
      { initialProps: { refresh: first } },
    );

    rerender({ refresh: second });
    act(() => vi.advanceTimersByTime(1000));

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it('cleans the interval when disabled after being enabled', () => {
    const refresh = vi.fn();
    const { rerender } = renderHook(
      ({ enabled }) => useAutoRefresh({ enabled, intervalMs: 1000, refresh }),
      { initialProps: { enabled: true } },
    );

    rerender({ enabled: false });
    act(() => vi.advanceTimersByTime(3000));

    expect(refresh).not.toHaveBeenCalled();
  });
});
