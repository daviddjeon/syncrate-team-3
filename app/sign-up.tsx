import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

export default function SignUpScreen() {
  const { role } = useLocalSearchParams<{ role: string }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const hasLength = password.length >= 6 && password.length <= 12;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasSpecialChar = /[._!]/.test(password);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <View style={styles.form}>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Create Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
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

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
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

        <TouchableOpacity style={styles.signUpButton} onPress={() => {}}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.googleButton}>
          <Image
            source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
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
    paddingTop: 40,
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
    color: '#000',
  },
  input: {
    backgroundColor: '#D3D3D3',
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
    backgroundColor: '#C8C8C8',
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
    color: '#000',
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
    backgroundColor: '#999',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 16,
    color: '#333',
  },
  googleButton: {
    backgroundColor: '#C8C8C8',
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
    color: '#000',
  },
});
