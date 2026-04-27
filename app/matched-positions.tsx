import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';
import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';
import { useAppTheme } from '@/contexts/theme-context';

interface MatchedRow {
  id: string;
  pos: string;
  sku: string;
}

const createInitialRows = (): MatchedRow[] =>
  Array.from({ length: 8 }, (_, i) => ({
    id: `row-${i}`,
    pos: '',
    sku: '',
  }));

type SortOption = 'pos-asc' | 'pos-desc' | 'sku-asc' | 'sku-desc';

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'pos-asc', label: 'POS (A → Z)' },
  { key: 'pos-desc', label: 'POS (Z → A)' },
  { key: 'sku-asc', label: 'SKU (A → Z)' },
  { key: 'sku-desc', label: 'SKU (Z → A)' },
];

export default function MatchedPositionsScreen() {
  const router = useRouter();
  const { position } = useLocalSearchParams<{ position: string }>();
  const { role } = useAuth();
  const { colors } = useAppTheme();
  const isMerchant = role === 'merchant-seller';
  const [rows, setRows] = useState<MatchedRow[]>(createInitialRows);
  const [sortVisible, setSortVisible] = useState(false);
  const [activeSort, setActiveSort] = useState<SortOption | null>(null);

  const updateRow = (id: string, field: 'pos' | 'sku', value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const sortedRows = () => {
    if (!activeSort) return rows;
    const sorted = [...rows];
    sorted.sort((a, b) => {
      const fieldKey = activeSort.startsWith('pos') ? 'pos' : 'sku';
      const aVal = a[fieldKey].toLowerCase();
      const bVal = b[fieldKey].toLowerCase();
      if (!aVal && !bVal) return 0;
      if (!aVal) return 1;
      if (!bVal) return -1;
      const cmp = aVal.localeCompare(bVal);
      return activeSort.endsWith('desc') ? -cmp : cmp;
    });
    return sorted;
  };

  const handleSort = (option: SortOption) => {
    setActiveSort(option);
    setSortVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Sort Modal */}
      <Modal visible={sortVisible} transparent animationType="fade" onRequestClose={() => setSortVisible(false)}>
        <Pressable style={[styles.modalBackdrop, { backgroundColor: colors.modalBackdrop }]} onPress={() => setSortVisible(false)}>
          <View style={[styles.sortCard, { backgroundColor: colors.surface, borderColor: colors.border }]} onStartShouldSetResponder={() => true}>
            <Text style={[styles.sortCardTitle, { color: colors.text }]}>Sort By</Text>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.sortOption, { backgroundColor: colors.surfaceAlt }, activeSort === opt.key && { backgroundColor: colors.activeSort }]}
                onPress={() => handleSort(opt.key)}
              >
                <Text style={[styles.sortOptionText, { color: colors.text }, activeSort === opt.key && { color: colors.activeSortText }]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={[styles.backIcon, { color: colors.icon }]}>&#8249;</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sortButton} onPress={() => setSortVisible(true)}>
        <Text style={[styles.sortText, { color: colors.text }]}>&#9776; Sort By{activeSort ? ` · ${SORT_OPTIONS.find((o) => o.key === activeSort)?.label}` : ''}</Text>
      </TouchableOpacity>

      {/* Table */}
      <View style={[styles.table, { borderColor: colors.border }]}>
        {/* Table Header */}
        <View style={[styles.tableHeader, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
          <Text style={[styles.colHeaderPos, { color: colors.text }]}>POS</Text>
          <View style={[styles.colDivider, { backgroundColor: colors.border }]} />
          <Text style={[styles.colHeaderSku, { color: colors.text }]}>SKU</Text>
        </View>

        {/* Scrollable Rows */}
        <FlatList
          data={sortedRows()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.tableRow, { borderBottomColor: colors.borderLight }]}>
              <TextInput
                style={[styles.cellPos, { color: colors.text }]}
                value={item.pos}
                onChangeText={(val) => updateRow(item.id, 'pos', val)}
                placeholder=""
                placeholderTextColor={colors.textSecondary}
                editable={!isMerchant}
              />
              <View style={[styles.cellDivider, { backgroundColor: colors.borderLight }]} />
              <TextInput
                style={[styles.cellSku, { color: colors.text }]}
                value={item.sku}
                onChangeText={(val) => updateRow(item.id, 'sku', val)}
                placeholder="Enter SKU"
                placeholderTextColor={colors.textSecondary}
                editable={!isMerchant}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 56,
    paddingHorizontal: 16,
  },
  backIcon: {
    fontSize: 36,
    fontWeight: '300',
    lineHeight: 36,
    marginBottom: 10,
  },
  sortButton: {
    marginBottom: 10,
  },
  sortText: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  table: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
  },
  colHeaderPos: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  colDivider: {
    width: 1,
  },
  colHeaderSku: {
    flex: 2,
    fontSize: 22,
    fontWeight: '700',
    paddingVertical: 12,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    minHeight: 80,
  },
  cellPos: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  cellDivider: {
    width: 1,
  },
  cellSku: {
    flex: 2,
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortCard: {
    borderRadius: 12,
    padding: 20,
    width: '70%',
    borderWidth: 1,
    gap: 8,
  },
  sortCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  sortOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  sortOptionText: {
    fontSize: 14,
  },
});
