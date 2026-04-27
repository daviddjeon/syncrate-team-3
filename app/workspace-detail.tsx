import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useAuth } from '@/contexts/auth-context';
import { useInventory, SkuItem } from '@/contexts/inventory-context';
import { useAppTheme } from '@/contexts/theme-context';

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
  const { name, id, retailer, description, timeCreated, joinCode, isOwner, createdBy } = useLocalSearchParams<{
    name: string;
    id: string;
    retailer: string;
    description: string;
    timeCreated: string;
    joinCode: string;
    isOwner: string;
    createdBy: string;
  }>();
  const router = useRouter();
  const { displayName: currentUserName, role } = useAuth();
  const { getItems, loadItems, addItem } = useInventory();
  const { colors } = useAppTheme();
  const items = getItems(id || '');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (id) loadItems(id);
  }, [id]);
  const [infoVisible, setInfoVisible] = useState(false);
  const [selectedSku, setSelectedSku] = useState<SkuItem | null>(null);
  const [sortVisible, setSortVisible] = useState(false);
  const [activeSort, setActiveSort] = useState<'sku-asc' | 'sku-desc' | 'num-asc' | 'num-desc' | 'time-asc' | 'time-desc' | null>(null);

  const SORT_OPTIONS: { key: typeof activeSort; label: string }[] = [
    { key: 'sku-asc', label: 'SKU (A → Z)' },
    { key: 'sku-desc', label: 'SKU (Z → A)' },
    { key: 'num-asc', label: 'NUM (Low → High)' },
    { key: 'num-desc', label: 'NUM (High → Low)' },
    { key: 'time-asc', label: 'Time (Oldest)' },
    { key: 'time-desc', label: 'Time (Newest)' },
  ];

  const getSortedItems = () => {
    const items2 = [...items];
    if (activeSort) {
      items2.sort((a, b) => {
        if (activeSort === 'sku-asc') return a.sku.localeCompare(b.sku);
        if (activeSort === 'sku-desc') return b.sku.localeCompare(a.sku);
        if (activeSort === 'num-asc') return a.num - b.num;
        if (activeSort === 'num-desc') return b.num - a.num;
        if (activeSort === 'time-asc') return a.timeScanned.localeCompare(b.timeScanned);
        if (activeSort === 'time-desc') return b.timeScanned.localeCompare(a.timeScanned);
        return 0;
      });
    }
    return items2;
  };

  const dataRows = [...getSortedItems(), ...PLACEHOLDER_ROWS];

  const handleUploadCsv = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'text/comma-separated-values', copyToCacheDirectory: true });
    if (result.canceled || !result.assets?.[0]) return;

    try {
      const text = await fetch(result.assets[0].uri).then((r) => r.text());
      const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
      if (lines.length < 2) { Alert.alert('Error', 'CSV must have a header row and at least one data row.'); return; }

      const headers = lines[0].toLowerCase().split(',').map((h) => h.trim());
      const skuIdx = headers.indexOf('sku');
      const numIdx = headers.indexOf('num');
      if (skuIdx === -1 || numIdx === -1) { Alert.alert('Error', 'CSV must have "sku" and "num" columns.'); return; }

      let imported = 0;
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map((c) => c.trim());
        const sku = cols[skuIdx];
        const num = parseInt(cols[numIdx], 10);
        if (!sku || isNaN(num)) continue;
        addItem(id!, {
          sku,
          num,
          timeScanned: new Date().toISOString(),
          scannedBy: currentUserName,
          positions: [],
          picture: null,
          descriptions: '',
        });
        imported++;
      }
      Alert.alert('Success', `Imported ${imported} item${imported !== 1 ? 's' : ''}.`);
    } catch {
      Alert.alert('Error', 'Could not read the file.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Info Modal */}
      <Modal visible={infoVisible} transparent animationType="fade" onRequestClose={() => setInfoVisible(false)}>
        <Pressable style={[styles.modalBackdrop, { backgroundColor: colors.modalBackdrop }]} onPress={() => setInfoVisible(false)}>
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]} onStartShouldSetResponder={() => true}>
            <Text style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Workspace ID:  </Text>
              <Text style={[styles.infoValue, { color: colors.textSecondary }]}>{id || 'ab123456'}</Text>
            </Text>
            {isOwner === '1' && (
              <Text style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: colors.text }]}>Join Code:  </Text>
                <Text style={[styles.infoValue, { color: colors.textSecondary }]}>{joinCode || '—'}</Text>
              </Text>
            )}
            <Text style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Time Created:  </Text>
              <Text style={[styles.infoValue, { color: colors.textSecondary }]}>{formatDateTime(timeCreated || '')}</Text>
            </Text>
            <Text style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Created By:   </Text>
              <Text style={[styles.infoValue, { color: colors.textSecondary }]}>{createdBy || currentUserName || 'Display Name'}</Text>
            </Text>
            <Text style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Total Earned:  </Text>
              <Text style={[styles.infoValue, { color: colors.textSecondary }]}>$ 1000</Text>
            </Text>
            <View style={styles.infoSection}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Descriptions:</Text>
              <Text style={[styles.infoValue, { color: colors.textSecondary }]}>{description || ''}</Text>
            </View>
            <View style={styles.infoSection}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Retailer:</Text>
              <Text style={[styles.infoValue, { color: colors.textSecondary }]}>{retailer || ''}</Text>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Sort Modal */}
      <Modal visible={sortVisible} transparent animationType="fade" onRequestClose={() => setSortVisible(false)}>
        <Pressable style={[styles.modalBackdrop, { backgroundColor: colors.modalBackdrop }]} onPress={() => setSortVisible(false)}>
          <View style={[styles.sortCard, { backgroundColor: colors.surface, borderColor: colors.border }]} onStartShouldSetResponder={() => true}>
            <Text style={[styles.sortCardTitle, { color: colors.text }]}>Sort By</Text>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.key}
                style={[styles.sortOptionItem, { backgroundColor: colors.surfaceAlt }, activeSort === opt.key && { backgroundColor: colors.activeSort }]}
                onPress={() => { setActiveSort(opt.key); setSortVisible(false); }}
              >
                <Text style={[styles.sortOptionText, { color: colors.text }, activeSort === opt.key && { color: colors.activeSortText }]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* SKU Detail Modal */}
      <Modal visible={!!selectedSku} transparent animationType="fade" onRequestClose={() => setSelectedSku(null)}>
        <Pressable style={[styles.modalBackdrop, { backgroundColor: colors.modalBackdrop }]} onPress={() => setSelectedSku(null)}>
          <View style={[styles.skuCard, { backgroundColor: colors.surface, borderColor: colors.border }]} onStartShouldSetResponder={() => true}>
            <Text style={styles.skuDetailRow}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Time Scanned:  </Text>
              <Text style={[styles.infoValue, { color: colors.textSecondary }]}>{formatDateTime(selectedSku?.timeScanned || '')}</Text>
            </Text>
            <Text style={styles.skuDetailRow}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Scanned By:   </Text>
              <Text style={[styles.infoValue, { color: colors.textSecondary }]}>{selectedSku?.scannedBy || ''}</Text>
            </Text>
            <View style={styles.infoSection}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Positions:</Text>
              {selectedSku?.positions.map((pos, idx) => (
                <View key={idx} style={styles.positionRow}>
                  <TouchableOpacity onPress={() => { setSelectedSku(null); router.push({ pathname: '/matched-positions', params: { position: pos.name } }); }}>
                    <Text style={[styles.positionName, { color: colors.text }]}>{pos.name}:</Text>
                  </TouchableOpacity>
                  {role !== 'merchant-seller' && (
                    <TouchableOpacity style={[styles.positionBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
                      <Text style={[styles.positionBtnText, { color: colors.text }]}>+</Text>
                    </TouchableOpacity>
                  )}
                  <Text style={[styles.positionCount, { color: colors.text }]}>{pos.count}</Text>
                  {role !== 'merchant-seller' && (
                    <TouchableOpacity style={[styles.positionBtn, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
                      <Text style={[styles.positionBtnText, { color: colors.text }]}>-</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
            <View style={styles.infoSection}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Picture:</Text>
              <View style={[styles.pictureBox, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]} />
            </View>
            <View style={styles.infoSection}>
              <Text style={[styles.infoLabel, { color: colors.text }]}>Descriptions:</Text>
              <Text style={[styles.infoValue, { color: colors.textSecondary }]}>{selectedSku?.descriptions || ''}</Text>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backIcon, { color: colors.icon }]}>&#8249;</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{name || 'Space Name'}</Text>
        <TouchableOpacity onPress={() => setInfoVisible(true)}>
          <Text style={[styles.headerInfoIcon, { color: colors.icon }]}>&#9432;</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        {role !== 'merchant-seller' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
            onPress={() => router.push({ pathname: '/scanner', params: { spaceName: name, workspaceId: id } })}>
            <Text style={[styles.actionIcon, { color: colors.textSecondary }]}>&#128247;</Text>
            <Text style={[styles.actionText, { color: colors.text }]}>Start Scanning</Text>
          </TouchableOpacity>
        )}

        {role !== 'merchant-seller' && (
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]} onPress={handleUploadCsv}>
            <Text style={[styles.actionIcon, { color: colors.textSecondary }]}>&#8613;</Text>
            <Text style={[styles.actionText, { color: colors.text }]}>Upload CSV</Text>
          </TouchableOpacity>
        )}

        <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
          <Text style={[styles.searchIcon, { color: colors.textSecondary }]}>Q</Text>
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search SKU"
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Sort / Download Row */}
      <View style={styles.toolRow}>
        <TouchableOpacity style={styles.sortButton} onPress={() => setSortVisible(true)}>
          <Text style={[styles.toolText, { color: colors.text }]}>&#9776; Sort By{activeSort ? ` · ${SORT_OPTIONS.find((o) => o.key === activeSort)?.label}` : ''}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadButton}>
          <Text style={[styles.toolText, { color: colors.text }]}>Download CSV &#8615;</Text>
        </TouchableOpacity>
      </View>

      {/* Table Header */}
      <View style={[styles.tableHeader, { borderBottomColor: colors.divider }]}>
        <Text style={[styles.colHeaderSku, { color: colors.text }]}>SKU</Text>
        <Text style={[styles.colHeaderNum, { color: colors.text }]}>NUM</Text>
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
            style={[styles.tableRow, { backgroundColor: colors.surface, borderBottomColor: colors.borderLight }]}
            disabled={!item.sku}
            onPress={() => {
              if (item.sku) {
                const found = items.find((m) => m.sku === item.sku);
                if (found) setSelectedSku(found);
              }
            }}>
            <Text style={[styles.cellSku, { color: colors.text }]}>{item.sku}</Text>
            <Text style={[styles.cellNum, { color: colors.text }]}>{item.sku ? item.num : ''}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontWeight: '300',
    lineHeight: 36,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  headerInfoIcon: {
    fontSize: 24,
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
    borderRadius: 8,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 1,
  },
  actionIcon: {
    fontSize: 16,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
    fontWeight: '700',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
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
    textDecorationLine: 'underline',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  colHeaderSku: {
    flex: 3,
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  colHeaderNum: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
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
    marginHorizontal: 4,
    marginTop: 2,
    borderRadius: 4,
    minHeight: 38,
  },
  cellSku: {
    flex: 3,
    fontSize: 13,
    textAlign: 'center',
  },
  cellNum: {
    flex: 1,
    fontSize: 13,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    borderRadius: 12,
    padding: 24,
    width: '80%',
    borderWidth: 1,
    gap: 12,
  },
  infoRow: {
    fontSize: 14,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  infoValue: {
    fontSize: 14,
  },
  infoSection: {
    gap: 2,
  },
  skuCard: {
    borderRadius: 12,
    padding: 24,
    width: '85%',
    borderWidth: 1,
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
    width: 90,
  },
  positionBtn: {
    width: 26,
    height: 26,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  positionBtnText: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 18,
  },
  positionCount: {
    fontSize: 15,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  },
  pictureBox: {
    height: 60,
    borderRadius: 6,
    marginTop: 4,
    borderWidth: 1,
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
  sortOptionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  sortOptionText: {
    fontSize: 14,
  },
});
