import React, { createContext, useContext, useState, useCallback } from 'react';

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
  /** Get items for a specific workspace */
  getItems: (workspaceId: string) => SkuItem[];
  /** Add or merge an item into a workspace's inventory */
  addItem: (workspaceId: string, item: SkuItem) => void;
}

const InventoryContext = createContext<InventoryContextType>({
  getItems: () => [],
  addItem: () => {},
});

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  // Map of workspaceId -> SkuItem[]
  const [store, setStore] = useState<Record<string, SkuItem[]>>({});

  const getItems = useCallback(
    (workspaceId: string): SkuItem[] => store[workspaceId] ?? [],
    [store],
  );

  const addItem = useCallback((workspaceId: string, item: SkuItem) => {
    setStore((prev) => {
      const existing = prev[workspaceId] ?? [];
      // If the SKU already exists, increment its count and merge positions
      const idx = existing.findIndex((e) => e.sku === item.sku);
      if (idx >= 0) {
        const updated = [...existing];
        const old = updated[idx];
        // Merge position counts
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
        updated[idx] = {
          ...old,
          num: old.num + item.num,
          positions: mergedPositions,
          // Keep newer scan time
          timeScanned: item.timeScanned,
          // Keep newer photo/description if provided
          picture: item.picture ?? old.picture,
          descriptions: item.descriptions || old.descriptions,
        };
        return { ...prev, [workspaceId]: updated };
      }
      return { ...prev, [workspaceId]: [...existing, item] };
    });
  }, []);

  return (
    <InventoryContext.Provider value={{ getItems, addItem }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}
