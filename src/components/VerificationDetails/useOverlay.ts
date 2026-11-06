import { useCallback, useRef, useState } from 'react';
import type { DetailTarget } from './types';

// 视图焦点属于 UI 层，不放进共享业务 model。
export function useVerificationOverlay() {
  const [target, setTarget] = useState<DetailTarget | null>(null);
  const current = useRef<DetailTarget | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const onChange = useCallback((next: DetailTarget | null) => {
    if (!current.current && next)
      trigger.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
    current.current = next;
    setTarget(next);
  }, []);
  const restoreFocus = useCallback(() => {
    if (current.current) return;
    const element = trigger.current?.isConnected
      ? trigger.current
      : document.querySelector<HTMLElement>('h1');
    element?.focus();
  }, []);
  return { target, onChange, restoreFocus };
}
