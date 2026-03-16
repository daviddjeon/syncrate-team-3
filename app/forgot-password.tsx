import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const hasLength = newPassword.length >= 6 && newPassword.length <= 12;
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasSpecialChar = /[._!]/.test(newPassword);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backIcon}>&#8249;</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Forgot Password</Text>

      <View style={styles.form}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Enter Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity>
            <Text style={styles.linkText}>Get Security Code</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Enter Security Code</Text>
          <TextInput
            style={styles.input}
            value={securityCode}
            onChangeText={setSecurityCode}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>New Password</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Reenter Password</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
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

        <TouchableOpacity style={styles.resetButton} onPress={() => router.back()}>
          <Text style={styles.resetButtonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  container: {
    paddingHorizontal: 30,
    paddingTop: 56,
    paddingBottom: 50,
  },
  backIcon: {
    fontSize: 36,
    color: '#000',
    fontWeight: '300',
    lineHeight: 36,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 40,
    color: '#000',
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
    color: '#000',
  },
  input: {
    backgroundColor: '#D3D3D3',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
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
    backgroundColor: '#C8C8C8',
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
    color: '#FFF',
  },
});
