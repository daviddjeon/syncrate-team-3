import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function CreateAccountScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.roleButton}
        onPress={() => router.push({ pathname: '/sign-up', params: { role: 'warehouse-owner' } })}
      >
        <Text style={styles.roleText}>Sign Up{'\n'}as{'\n'}Warehouse Owner</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.roleButton}
        onPress={() => router.push({ pathname: '/sign-up', params: { role: 'merchant-seller' } })}
      >
        <Text style={styles.roleText}>Sign Up{'\n'}as{'\n'}Merchant Seller</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 50,
  },
  roleButton: {
    backgroundColor: '#D3D3D3',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#999',
    paddingVertical: 30,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  roleText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
    lineHeight: 36,
  },
});
