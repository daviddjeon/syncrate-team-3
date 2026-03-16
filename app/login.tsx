import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';
import { useAppTheme } from '@/contexts/theme-context';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { signIn } = useAuth();
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.topSection}>
        <TouchableOpacity style={styles.forgotLink} onPress={() => router.push('/forgot-password')}>
          <Text style={[styles.forgotText, { color: '#4A90D9' }]}>Forgot Password</Text>
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.text }]}>Log In</Text>

        <View style={styles.form}>
          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: colors.buttonBg }]}
            onPress={() => {
              signIn(email ? email.split('@')[0] : 'User', email);
              router.replace('/(tabs)');
            }}>
            <Text style={[styles.loginButtonText, { color: colors.buttonText }]}>Log In</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 60,
  },
  topSection: {},
  forgotLink: {
    alignSelf: 'flex-end',
  },
  forgotText: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 30,
  },
  form: {
    gap: 16,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
  },
  input: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  loginButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    width: '60%',
    marginTop: 12,
  },
  loginButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  bottomSection: {
    paddingBottom: 50,
    gap: 24,
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
