import { useCallback, useEffect, useRef } from "react";

interface UseDraftQueueOptions<T> {
  persist: (item: T) => Promise<void>;
  onError?: (error: Error, item: T) => void;
  delayMs?: number;
}

/** Debounced, serialized persistence queue that flushes safely on switch, publish, and page hide. */
export function useDraftQueue<T>({
  persist,
  onError,
  delayMs = 700,
}: UseDraftQueueOptions<T>) {
  const persistRef = useRef(persist);
  const onErrorRef = useRef(onError);
  persistRef.current = persist;
  onErrorRef.current = onError;

  const pendingRef = useRef<T | null>(null);
  const latestRef = useRef<T | null>(null);
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const savingCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const enqueuePersist = useCallback((item: T): Promise<void> => {
    savingCountRef.current += 1;
    const operation = queueRef.current
      .catch(() => {})
      .then(() => persistRef.current(item))
      .finally(() => {
        savingCountRef.current -= 1;
      });
    queueRef.current = operation;
    return operation;
  }, []);

  const flush = useCallback(async (): Promise<void> => {
    clearTimeout(timerRef.current);
    const item = pendingRef.current;
    pendingRef.current = null;
    try {
      if (item !== null) {
        await enqueuePersist(item);
      } else {
        await queueRef.current;
      }
    } catch (err) {
      if (
        item !== null &&
        pendingRef.current === null &&
        latestRef.current === item
      ) {
        pendingRef.current = item;
      }
      throw err;
    }
  }, [enqueuePersist]);

  const schedule = useCallback(
    (item: T) => {
      latestRef.current = item;
      pendingRef.current = item;
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        void flush().catch((err) => {
          onErrorRef.current?.(
            err instanceof Error ? err : new Error(String(err)),
            item,
          );
        });
      }, delayMs);
    },
    [delayMs, flush],
  );

  const cancel = useCallback(() => {
    clearTimeout(timerRef.current);
    pendingRef.current = null;
    latestRef.current = null;
  }, []);

  useEffect(() => {
    const flushQuietly = () => {
      if (pendingRef.current !== null) {
        void flush().catch(() => {});
      }
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") flushQuietly();
    };
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (pendingRef.current !== null || savingCountRef.current > 0) {
        flushQuietly();
        e.preventDefault();
      }
    };
    window.addEventListener("pagehide", flushQuietly);
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      flushQuietly();
      window.removeEventListener("pagehide", flushQuietly);
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [flush]);

  return { schedule, flush, cancel };
}
