import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

interface WorkspaceResult {
  id: string;
  name: string;
  createdBy: string;
  timeCreated: string;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  let hours = d.getHours();
  const mins = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  return `${y}/${m}/${day}   ${String(hours).padStart(2, '0')}:${mins}${ampm}`;
}

// Placeholder mock search — will be replaced with real backend lookup
const MOCK_WORKSPACES: WorkspaceResult[] = [
  {
    id: 'ws-001',
    name: 'Workspace Name',
    createdBy: 'Display Name',
    timeCreated: new Date().toISOString(),
  },
];

export default function JoinWorkspaceScreen() {
  const router = useRouter();
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState<WorkspaceResult | null>(null);

  const handleSearch = () => {
    // Mock: show a result for any non-empty search
    if (searchId.trim()) {
      setResult(MOCK_WORKSPACES[0]);
    } else {
      setResult(null);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.menuIcon}>&#9776;</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Join a Workspace</Text>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>&#128269;</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Workspace ID"
          placeholderTextColor="#888"
          value={searchId}
          onChangeText={setSearchId}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.resultName}>{result.name}</Text>

          <Text style={styles.resultLabel}>Created By</Text>
          <Text style={styles.resultValue}>   {result.createdBy}</Text>

          <Text style={styles.resultLabel}>Time Created</Text>
          <Text style={styles.resultValue}>   {formatDateTime(result.timeCreated)}</Text>

          <TouchableOpacity style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Join</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  menuIcon: {
    fontSize: 28,
    color: '#000',
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#000',
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 30,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
    color: '#666',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  resultCard: {
    backgroundColor: '#C8C8C8',
    borderRadius: 12,
    padding: 20,
    alignSelf: 'center',
    width: '75%',
    borderWidth: 1,
    borderColor: '#AAA',
  },
  resultName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
    marginBottom: 14,
  },
  resultLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000',
    marginTop: 8,
  },
  resultValue: {
    fontSize: 14,
    color: '#555',
  },
  joinButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#BBB',
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
