import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/contexts/theme-context';

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
  const { colors } = useAppTheme();
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState<WorkspaceResult | null>(null);

  const handleSearch = () => {
    if (searchId.trim()) {
      setResult(MOCK_WORKSPACES[0]);
    } else {
      setResult(null);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={[styles.menuIcon, { color: colors.icon }]}>&#9776;</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text }]}>Join a Workspace</Text>

      <View style={[styles.searchBar, { backgroundColor: colors.surfaceAlt }]}>
        <Text style={[styles.searchIcon, { color: colors.textSecondary }]}>&#128269;</Text>
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Workspace ID"
          placeholderTextColor={colors.textSecondary}
          value={searchId}
          onChangeText={setSearchId}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
      </View>

      {result && (
        <View style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.resultName, { color: colors.text }]}>{result.name}</Text>

          <Text style={[styles.resultLabel, { color: colors.text }]}>Created By</Text>
          <Text style={[styles.resultValue, { color: colors.textSecondary }]}>   {result.createdBy}</Text>

          <Text style={[styles.resultLabel, { color: colors.text }]}>Time Created</Text>
          <Text style={[styles.resultValue, { color: colors.textSecondary }]}>   {formatDateTime(result.timeCreated)}</Text>

          <TouchableOpacity style={[styles.joinButton, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
            <Text style={[styles.joinButtonText, { color: colors.text }]}>Join</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  menuIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 30,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  resultCard: {
    borderRadius: 12,
    padding: 20,
    alignSelf: 'center',
    width: '75%',
    borderWidth: 1,
  },
  resultName: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 14,
  },
  resultLabel: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
  },
  resultValue: {
    fontSize: 14,
  },
  joinButton: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginTop: 20,
    borderWidth: 1,
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
