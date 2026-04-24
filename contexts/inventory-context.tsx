import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export interface Position {
  name: string;
  count: number;
}

export interface SkuItem {
  sku: string;
  num: number;
  timeScanned: string;
  scannedBy: string;
  positions: Position[];
  picture: string | null;
  descriptions: string;
}

interface InventoryContextType {
  getItems: (workspaceId: string) => SkuItem[];
  addItem: (workspaceId: string, item: SkuItem) => void;
  loadItems: (workspaceId: string) => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType>({
  getItems: () => [],
  addItem: () => {},
  loadItems: async () => {},
});

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<Record<string, SkuItem[]>>({});

  const getItems = useCallback(
    (workspaceId: string): SkuItem[] => store[workspaceId] ?? [],
    [store],
  );

  const loadItems = useCallback(async (workspaceId: string) => {
    const { data, error } = await supabase
      .from('inventory_items')
      .select('*')
      .eq('workspace_id', workspaceId);

    if (!error && data) {
      setStore((prev) => ({
        ...prev,
        [workspaceId]: data.map((row) => ({
          sku: row.sku,
          num: row.num,
          timeScanned: row.time_scanned,
          scannedBy: row.scanned_by ?? '',
          positions: row.positions ?? [],
          picture: row.picture ?? null,
          descriptions: row.descriptions ?? '',
        })),
      }));
    }
  }, []);

  const addItem = useCallback((workspaceId: string, item: SkuItem) => {
    let mergedItem = item;

    setStore((prev) => {
      const existing = prev[workspaceId] ?? [];
      const idx = existing.findIndex((e) => e.sku === item.sku);
      if (idx >= 0) {
        const old = existing[idx];
        const mergedPositions = [...old.positions];
        for (const pos of item.positions) {
          const pIdx = mergedPositions.findIndex((p) => p.name === pos.name);
          if (pIdx >= 0) {
            mergedPositions[pIdx] = {
              ...mergedPositions[pIdx],
              count: mergedPositions[pIdx].count + pos.count,
            };
          } else {
            mergedPositions.push(pos);
          }
        }
        mergedItem = {
          ...old,
          num: old.num + item.num,
          positions: mergedPositions,
          timeScanned: item.timeScanned,
          picture: item.picture ?? old.picture,
          descriptions: item.descriptions || old.descriptions,
        };
        const updated = [...existing];
        updated[idx] = mergedItem;
        return { ...prev, [workspaceId]: updated };
      }
      return { ...prev, [workspaceId]: [...existing, item] };
    });

    // Save to Supabase after local state update
    supabase.from('inventory_items').upsert({
      workspace_id: workspaceId,
      sku: mergedItem.sku,
      num: mergedItem.num,
      time_scanned: mergedItem.timeScanned,
      scanned_by: mergedItem.scannedBy,
      positions: mergedItem.positions,
      picture: mergedItem.picture,
      descriptions: mergedItem.descriptions,
    }, { onConflict: 'workspace_id,sku' });
  }, []);

  return (
    <InventoryContext.Provider value={{ getItems, addItem, loadItems }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}
