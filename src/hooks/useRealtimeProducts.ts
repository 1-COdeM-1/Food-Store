import { useEffect, useRef } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
import { normalizeProduct } from '@/services/productService';
import type { Product } from '@/types';

// ---------------------------------------------------------------------------
// Hook options
// ---------------------------------------------------------------------------
interface UseRealtimeProductsOptions {
  /**
   * Called with a functional updater whenever a DB change arrives.
   * Pass the `setProducts` dispatcher from useState<Product[]>.
   */
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  /**
   * Gate the subscription. Useful to wait until the initial fetch finishes.
   * Defaults to true.
   */
  enabled?: boolean;
  /**
   * Optional callback fired after any realtime change.
   * Use this to re-run server-side queries (e.g. for pagination / total count).
   */
  onAnyChange?: () => void;
}

/**
 * `useRealtimeProducts`
 *
 * Subscribes to INSERT / UPDATE / DELETE events on the `Products` table and
 * merges each change into the provided state setter without a full page reload.
 * The Supabase channel is cleaned up automatically on component unmount.
 *
 * @example
 * const [products, setProducts] = useState<Product[]>([]);
 * useRealtimeProducts({ setProducts, enabled: !loading });
 */
export function useRealtimeProducts({
  setProducts,
  enabled = true,
  onAnyChange,
}: UseRealtimeProductsOptions): void {
  const channelRef = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (!enabled) return;

    // ── Subscribe ──────────────────────────────────────────────────────────
    // Table name must match EXACTLY what is in Supabase — "Products" (capital P)
    const channel = supabase
      .channel('realtime:Products')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Products' },
        (payload) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const newProduct = normalizeProduct(payload.new as Record<string, any>);
          setProducts((prev) => {
            // Prevent duplicates from optimistic updates
            if (prev.some((p) => p.id === newProduct.id)) return prev;
            return [newProduct, ...prev];
          });
          onAnyChange?.();
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'Products' },
        (payload) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const updated = normalizeProduct(payload.new as Record<string, any>);
          setProducts((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p))
          );
          onAnyChange?.();
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'Products' },
        (payload) => {
          const deletedId = (payload.old as { id: number }).id;
          setProducts((prev) => prev.filter((p) => p.id !== deletedId));
          onAnyChange?.();
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Realtime] ✅ Connected to Products table');
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('[Realtime] ❌ Channel error:', err);
        }
        if (status === 'TIMED_OUT') {
          console.warn('[Realtime] ⚠️ Channel timed out');
        }
        if (status === 'CLOSED') {
          console.log('[Realtime] Channel closed');
        }
      });

    channelRef.current = channel;

    // ── Cleanup ────────────────────────────────────────────────────────────
    return () => {
      if (channelRef.current) {
        void supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        console.log('[Realtime] Unsubscribed from Products table');
      }
    };
  // We deliberately exclude setProducts from deps — it is a stable dispatcher.
  // onAnyChange is also excluded to avoid re-subscribing on every render if
  // the caller passes an inline function.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}
