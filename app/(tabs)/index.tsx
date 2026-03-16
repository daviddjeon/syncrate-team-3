import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';
import { Sidebar } from '@/components/sidebar';
import { useAppTheme } from '@/contexts/theme-context';

export default function HomeScreen() {
  const { spaces } = useAuth();
  const router = useRouter();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Sidebar visible={sidebarVisible} onClose={() => setSidebarVisible(false)} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Text style={[styles.menuIcon, { color: colors.icon }]}>&#9776;</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/create-workspace')}>
          <Text style={[styles.addIcon, { color: colors.icon }]}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>My Work Spaces</Text>
      <View style={[styles.divider, { backgroundColor: colors.divider }]} />

      <FlatList
        data={spaces}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.spaceCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push({
              pathname: '/workspace-detail',
              params: {
                name: item.name,
                id: item.id,
                retailer: item.retailer,
                description: item.description,
                timeCreated: item.timeCreated,
              },
            })}>
            <Text style={[styles.spaceName, { color: colors.text }]}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  menuIcon: {
    fontSize: 28,
  },
  addIcon: {
    fontSize: 32,
    fontWeight: '300',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  divider: {
    height: 2,
    marginBottom: 20,
  },
  grid: {
    paddingBottom: 40,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  spaceCard: {
    width: '47%',
    aspectRatio: 0.85,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  spaceName: {
    fontSize: 20,
    fontWeight: '600',
  },
});
