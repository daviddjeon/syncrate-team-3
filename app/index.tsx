import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/contexts/theme-context';

export default function LandingScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topSection}>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.buttonBg }]} onPress={() => router.push('/login')}>
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: colors.buttonBg }]} onPress={() => router.push('/create-account')}>
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Create Account</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 22,
    fontWeight: '500',
  },
});
