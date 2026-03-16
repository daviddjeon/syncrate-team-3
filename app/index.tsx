import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
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

      <View style={styles.bottomSection}>
        <View style={styles.dividerContainer}>
          <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
          <Text style={[styles.dividerText, { color: colors.textSecondary }]}>OR</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.divider }]} />
        </View>

        <TouchableOpacity style={[styles.googleButton, { backgroundColor: colors.buttonBg }]}>
          <Image
            source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
            style={styles.googleIcon}
          />
          <Text style={[styles.googleButtonText, { color: colors.buttonText }]}>Continue with Google</Text>
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
  bottomSection: {
    paddingBottom: 80,
    gap: 30,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 16,
  },
  googleButton: {
    paddingVertical: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  googleIcon: {
    width: 24,
    height: 24,
  },
  googleButtonText: {
    fontSize: 20,
    fontWeight: '500',
  },
});
