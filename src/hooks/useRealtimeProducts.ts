import { useEffect, useRef } from 'react';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { normalizeProduct } from '@/services/productService';
import { PRODUCTS_QUERY_KEY } from '@/hooks/useProducts';
import type { Product } from '@/types';

// ---------------------------------------------------------------------------
// Hook options
// ---------------------------------------------------------------------------
interface UseRealtimeProductsOptions {
  /**
   * Gate the subscription. Useful to wait until the initial fetch finishes.
   * Defaults to true.
   */
  enabled?: boolean;
}

/**
 * `useRealtimeProducts`
 *
 * Subscribes to INSERT / UPDATE / DELETE events on the `Products` table and
 * mutates the React Query cache in-place without a full page reload.
 * The Supabase channel is cleaned up automatically on component unmount.
 */
export function useRealtimeProducts({
  enabled = true,
}: UseRealtimeProductsOptions = {}): void {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    // ── Subscribe ──────────────────────────────────────────────────────────
    const channel = supabase
      .channel('realtime:Products')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Products' },
        (payload) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const newProduct = normalizeProduct(payload.new as Record<string, any>);
          queryClient.setQueryData(PRODUCTS_QUERY_KEY, (oldData: Product[] | undefined) => {
            if (!oldData) return oldData;
            if (oldData.some((p) => p.id === newProduct.id)) return oldData;
            return [newProduct, ...oldData];
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'Products' },
        (payload) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const updated = normalizeProduct(payload.new as Record<string, any>);
          queryClient.setQueryData(PRODUCTS_QUERY_KEY, (oldData: Product[] | undefined) => {
            if (!oldData) return oldData;
            return oldData.map((p) => (p.id === updated.id ? updated : p));
          });
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'Products' },
        (payload) => {
          const deletedId = (payload.old as { id: number }).id;
          queryClient.setQueryData(PRODUCTS_QUERY_KEY, (oldData: Product[] | undefined) => {
            if (!oldData) return oldData;
            return oldData.filter((p) => p.id !== deletedId);
          });
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
  }, [enabled, queryClient]);
}

