import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useAppTheme } from '@/contexts/theme-context';

export default function SignUpScreen() {
  const { role } = useLocalSearchParams<{ role: string }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const router = useRouter();
  const { signIn } = useAuth();
  const { colors } = useAppTheme();

  const hasLength = password.length >= 6 && password.length <= 12;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasSpecialChar = /[._!]/.test(password);

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: colors.background }]} contentContainerStyle={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Sign Up</Text>

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
          <Text style={[styles.label, { color: colors.text }]}>Create Password</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Reenter Password</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Display Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
            value={displayName}
            onChangeText={setDisplayName}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.rules}>
          <Text style={hasLength ? styles.rulePass : styles.ruleFail}>
            {hasLength ? '\u2713 ' : '  '}Between 6-12 characters in length
          </Text>
          <Text style={hasUpperCase ? styles.rulePass : styles.ruleFail}>
            {hasUpperCase ? '\u2713 ' : '  '}Contains at least 1 upper case letter
          </Text>
          <Text style={hasLowerCase ? styles.rulePass : styles.ruleFail}>
            {hasLowerCase ? '\u2713 ' : '  '}Contains at least 1 lower case letter
          </Text>
          <Text style={hasSpecialChar ? styles.rulePass : styles.ruleFail}>
            {hasSpecialChar ? '\u2713 ' : '  '}Contains at least 1 special character in (._!)
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.signUpButton, { backgroundColor: colors.buttonBg }]}
          onPress={() => {
            signIn(displayName || 'User', email, role);
            router.replace('/(tabs)');
          }}>
          <Text style={[styles.signUpButtonText, { color: colors.buttonText }]}>Sign Up</Text>
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 30,
    paddingTop: 60,
    paddingBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
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
  rules: {
    gap: 4,
    marginTop: 4,
  },
  rulePass: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  ruleFail: {
    fontSize: 14,
    color: '#E57373',
    fontWeight: '500',
  },
  signUpButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    width: '70%',
    marginTop: 8,
  },
  signUpButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  bottomSection: {
    marginTop: 30,
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
