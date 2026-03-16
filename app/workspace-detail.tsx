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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';

interface Position {
  name: string;
  count: number;
}

interface SkuItem {
  sku: string;
  num: number;
  timeScanned: string;
  scannedBy: string;
  positions: Position[];
  picture: string | null;
  descriptions: string;
}

// Mock inventory data — will be replaced with real backend
const MOCK_ITEMS: SkuItem[] = [
  {
    sku: 'MWZX88888_B_XL',
    num: 3,
    timeScanned: new Date().toISOString(),
    scannedBy: 'Display Name',
    positions: [
      { name: 'Position 1', count: 1 },
      { name: 'Position 2', count: 3 },
    ],
    picture: null,
    descriptions: '',
  },
];

// Generate empty placeholder rows for the table
const PLACEHOLDER_ROWS = Array.from({ length: 20 }, (_, i) => ({
  sku: '',
  num: 0,
  key: `empty-${i}`,
}));

function formatDateTime(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${y}/${m}/${day}  ${h}:${min}`;
}

export default function WorkspaceDetailScreen() {
  const { name, id, retailer, description, timeCreated } = useLocalSearchParams<{
    name: string;
    id: string;
    retailer: string;
    description: string;
    timeCreated: string;
  }>();
  const router = useRouter();
  const { displayName } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [infoVisible, setInfoVisible] = useState(false);
  const [selectedSku, setSelectedSku] = useState<SkuItem | null>(null);

  const dataRows = [...MOCK_ITEMS, ...PLACEHOLDER_ROWS];

  return (
    <View style={styles.container}>
      {/* Info Modal */}
      <Modal visible={infoVisible} transparent animationType="fade" onRequestClose={() => setInfoVisible(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setInfoVisible(false)}>
          <View style={styles.infoCard} onStartShouldSetResponder={() => true}>
            <Text style={styles.infoRow}>
              <Text style={styles.infoLabel}>Workspace ID:  </Text>
              <Text style={styles.infoValue}>{id || 'ab123456'}</Text>
            </Text>

            <Text style={styles.infoRow}>
              <Text style={styles.infoLabel}>Time Created:  </Text>
              <Text style={styles.infoValue}>{formatDateTime(timeCreated || '')}</Text>
            </Text>

            <Text style={styles.infoRow}>
              <Text style={styles.infoLabel}>Created By:   </Text>
              <Text style={styles.infoValue}>{displayName || 'Display Name'}</Text>
            </Text>

            <Text style={styles.infoRow}>
              <Text style={styles.infoLabel}>Total Earned:  </Text>
              <Text style={styles.infoValue}>$ 1000</Text>
            </Text>

            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Descriptions:</Text>
              <Text style={styles.infoValue}>{description || ''}</Text>
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Retailer:</Text>
              <Text style={styles.infoValue}>{retailer || ''}</Text>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* SKU Detail Modal */}
      <Modal visible={!!selectedSku} transparent animationType="fade" onRequestClose={() => setSelectedSku(null)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setSelectedSku(null)}>
          <View style={styles.skuCard} onStartShouldSetResponder={() => true}>
            <Text style={styles.skuDetailRow}>
              <Text style={styles.infoLabel}>Time Scanned:  </Text>
              <Text style={styles.infoValue}>{formatDateTime(selectedSku?.timeScanned || '')}</Text>
            </Text>

            <Text style={styles.skuDetailRow}>
              <Text style={styles.infoLabel}>Scanned By:   </Text>
              <Text style={styles.infoValue}>{selectedSku?.scannedBy || ''}</Text>
            </Text>

            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Positions:</Text>
              {selectedSku?.positions.map((pos, idx) => (
                <View key={idx} style={styles.positionRow}>
                  <TouchableOpacity onPress={() => { setSelectedSku(null); router.push({ pathname: '/matched-positions', params: { position: pos.name } }); }}>
                    <Text style={styles.positionName}>{pos.name}:</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.positionBtn}>
                    <Text style={styles.positionBtnText}>+</Text>
                  </TouchableOpacity>
                  <Text style={styles.positionCount}>{pos.count}</Text>
                  <TouchableOpacity style={styles.positionBtn}>
                    <Text style={styles.positionBtnText}>-</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Picture:</Text>
              <View style={styles.pictureBox} />
            </View>

            <View style={styles.infoSection}>
              <Text style={styles.infoLabel}>Descriptions:</Text>
              <Text style={styles.infoValue}>{selectedSku?.descriptions || ''}</Text>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>&#8249;</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{name || 'Space Name'}</Text>
        <TouchableOpacity onPress={() => setInfoVisible(true)}>
          <Text style={styles.headerInfoIcon}>&#9432;</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push({ pathname: '/scanner', params: { spaceName: name } })}>
          <Text style={styles.actionIcon}>&#128247;</Text>
          <Text style={styles.actionText}>Start Scanning</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>&#8613;</Text>
          <Text style={styles.actionText}>Upload CSV</Text>
        </TouchableOpacity>

        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>Q</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search SKU"
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Sort / Download Row */}
      <View style={styles.toolRow}>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.toolText}>&#9776; Sort By</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadButton}>
          <Text style={styles.toolText}>Download CSV &#8615;</Text>
        </TouchableOpacity>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.colHeaderSku}>SKU</Text>
        <Text style={styles.colHeaderNum}>NUM</Text>
      </View>

      {/* Scrollable Table */}
      <FlatList
        data={dataRows}
        keyExtractor={(item, index) =>
          item.sku ? item.sku : `empty-${index}`
        }
        style={styles.tableList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.tableRow}
            disabled={!item.sku}
            onPress={() => {
              if (item.sku) {
                const found = MOCK_ITEMS.find((m) => m.sku === item.sku);
                if (found) setSelectedSku(found);
              }
            }}>
            <Text style={styles.cellSku}>{item.sku}</Text>
            <Text style={styles.cellNum}>{item.sku ? item.num : ''}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingTop: 56,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  backIcon: {
    fontSize: 36,
    color: '#000',
    fontWeight: '300',
    lineHeight: 36,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },
  headerInfoIcon: {
    fontSize: 24,
    color: '#000',
  },
  actions: {
    paddingHorizontal: 24,
    gap: 10,
    marginBottom: 14,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: '#BBB',
  },
  actionIcon: {
    fontSize: 16,
    color: '#333',
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
    color: '#888',
    fontWeight: '700',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },
  toolRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toolText: {
    fontSize: 13,
    color: '#000',
    textDecorationLine: 'underline',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#999',
  },
  colHeaderSku: {
    flex: 3,
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  colHeaderNum: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  tableList: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    backgroundColor: '#E8E8E8',
    marginHorizontal: 4,
    marginTop: 2,
    borderRadius: 4,
    minHeight: 38,
  },
  cellSku: {
    flex: 3,
    fontSize: 13,
    color: '#000',
    textAlign: 'center',
  },
  cellNum: {
    flex: 1,
    fontSize: 13,
    color: '#000',
    textAlign: 'center',
  },
  // Info Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    borderWidth: 1,
    borderColor: '#CCC',
    gap: 12,
  },
  infoRow: {
    fontSize: 14,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000',
  },
  infoValue: {
    fontSize: 14,
    color: '#555',
  },
  infoSection: {
    gap: 2,
  },
  // SKU Detail Modal
  skuCard: {
    backgroundColor: '#E8E8E8',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    borderWidth: 1,
    borderColor: '#CCC',
    gap: 16,
  },
  skuDetailRow: {
    fontSize: 14,
  },
  positionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingVertical: 4,
    gap: 12,
  },
  positionName: {
    fontSize: 14,
    color: '#000',
    width: 90,
  },
  positionBtn: {
    width: 26,
    height: 26,
    borderRadius: 4,
    backgroundColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#AAA',
  },
  positionBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    lineHeight: 18,
  },
  positionCount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    minWidth: 20,
    textAlign: 'center',
  },
  pictureBox: {
    height: 60,
    backgroundColor: '#D9D9D9',
    borderRadius: 6,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#BBB',
  },
});
