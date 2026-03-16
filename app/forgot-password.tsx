import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/contexts/theme-context';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [email, setEmail] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const hasLength = newPassword.length >= 6 && newPassword.length <= 12;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasSpecialChar = /[._!]/.test(newPassword);

  return (
    <ScrollView style={[styles.scroll, { backgroundColor: colors.background }]} contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={[styles.backIcon, { color: colors.text }]}>&#8249;</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text }]}>Forgot Password</Text>

      <View style={styles.form}>
        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Enter Email</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor={colors.textSecondary}
          />
          <TouchableOpacity>
            <Text style={[styles.linkText, { color: colors.text }]}>Get Security Code</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Enter Security Code</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
            value={securityCode}
            onChangeText={setSecurityCode}
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.label, { color: colors.text }]}>New Password</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text }]}
            value={newPassword}
            onChangeText={setNewPassword}
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

        <TouchableOpacity style={[styles.resetButton, { backgroundColor: colors.buttonBg }]} onPress={() => router.back()}>
          <Text style={[styles.resetButtonText, { color: colors.buttonText }]}>Reset Password</Text>
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
    paddingTop: 56,
    paddingBottom: 50,
  },
  backIcon: {
    fontSize: 36,
    fontWeight: '300',
    lineHeight: 36,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    gap: 20,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
    marginTop: 4,
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
  resetButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    width: '70%',
    marginTop: 16,
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
