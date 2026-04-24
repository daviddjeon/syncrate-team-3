import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '@/contexts/theme-context';

export default function CreateAccountScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color={colors.text} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.roleButton, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => router.push({ pathname: '/sign-up', params: { role: 'warehouse-owner' } })}
      >
        <Text style={[styles.roleText, { color: colors.text }]}>Sign Up{'\n'}as{'\n'}Warehouse Owner</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.roleButton, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => router.push({ pathname: '/sign-up', params: { role: 'merchant-seller' } })}
      >
        <Text style={[styles.roleText, { color: colors.text }]}>Sign Up{'\n'}as{'\n'}Merchant Seller</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 50,
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  roleButton: {
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 30,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  roleText: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 36,
  },
});
