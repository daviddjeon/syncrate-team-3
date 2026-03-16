import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface MatchedRow {
  pos: string;
  sku: string;
}

// Mock data — will be replaced with real backend
const MOCK_DATA: MatchedRow[] = [];

// Generate empty placeholder rows
const PLACEHOLDER_ROWS = Array.from({ length: 8 }, (_, i) => ({
  pos: '',
  sku: '',
  key: `empty-${i}`,
}));

export default function MatchedPositionsScreen() {
  const router = useRouter();
  const { position } = useLocalSearchParams<{ position: string }>();

  const dataRows = [...MOCK_DATA, ...PLACEHOLDER_ROWS];

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backIcon}>&#8249;</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.sortButton}>
        <Text style={styles.sortText}>&#9776; Sort By</Text>
      </TouchableOpacity>

      {/* Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.colHeaderPos}>POS</Text>
          <View style={styles.colDivider} />
          <Text style={styles.colHeaderSku}>SKU</Text>
        </View>

        {/* Scrollable Rows */}
        <FlatList
          data={dataRows}
          keyExtractor={(item, index) =>
            item.pos ? `${item.pos}-${item.sku}` : `empty-${index}`
          }
          renderItem={({ item }) => (
            <View style={styles.tableRow}>
              <Text style={styles.cellPos}>{item.pos}</Text>
              <View style={styles.cellDivider} />
              <Text style={styles.cellSku}>{item.sku}</Text>
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
    backgroundColor: '#F2F2F2',
    paddingTop: 56,
    paddingHorizontal: 16,
  },
  backIcon: {
    fontSize: 36,
    color: '#000',
    fontWeight: '300',
    lineHeight: 36,
    marginBottom: 10,
  },
  sortButton: {
    marginBottom: 10,
  },
  sortText: {
    fontSize: 14,
    color: '#000',
    textDecorationLine: 'underline',
  },
  table: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
    backgroundColor: '#F2F2F2',
  },
  colHeaderPos: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  colDivider: {
    width: 1,
    backgroundColor: '#000',
  },
  colHeaderSku: {
    flex: 2,
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    paddingVertical: 12,
    paddingHorizontal: 10,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    minHeight: 80,
  },
  cellPos: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  cellDivider: {
    width: 1,
    backgroundColor: '#CCC',
  },
  cellSku: {
    flex: 2,
    fontSize: 14,
    color: '#000',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
});
