import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';

function formatDateTime(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${y}/${m}/${d}  ${h}:${min}:${s}`;
}

export default function CreateWorkspaceScreen() {
  const router = useRouter();
  const { addSpace } = useAuth();

  const [name, setName] = useState('');
  const [pricePerProduct, setPricePerProduct] = useState('');
  const [pricePerProductPerDay, setPricePerProductPerDay] = useState('');
  const [retailer, setRetailer] = useState('');
  const [description, setDescription] = useState('');
  const now = new Date();

  const handleCreate = () => {
    if (!name.trim()) return;
    addSpace({
      name: name.trim(),
      pricePerProduct,
      pricePerProductPerDay,
      retailer,
      description,
      displayImage: null,
      timeCreated: now.toISOString(),
    });
    router.back();
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.fieldGroup}>
        <Text style={styles.label}>
          Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder=""
        />
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>$</Text>
        <TextInput
          style={styles.priceInput}
          value={pricePerProduct}
          onChangeText={setPricePerProduct}
          keyboardType="numeric"
          placeholder=""
        />
        <Text style={styles.priceDesc}>/ product (organizing)</Text>
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.priceLabel}>$</Text>
        <TextInput
          style={styles.priceInput}
          value={pricePerProductPerDay}
          onChangeText={setPricePerProductPerDay}
          keyboardType="numeric"
          placeholder=""
        />
        <Text style={styles.priceDesc}>/ product / day (storage)</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Retailer</Text>
        <TextInput
          style={styles.input}
          value={retailer}
          onChangeText={setRetailer}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Display Image</Text>
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>upload image</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Time Created</Text>
        <View style={styles.timeBox}>
          <Text style={styles.timeText}>{formatDateTime(now)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
        <Text style={styles.createButtonText}>Create</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 50,
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
  required: {
    color: '#E53935',
  },
  input: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  priceInput: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    width: 70,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  priceDesc: {
    fontSize: 14,
    color: '#555',
  },
  uploadButton: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#CCC',
  },
  uploadButtonText: {
    fontSize: 14,
    color: '#555',
  },
  timeBox: {
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  timeText: {
    fontSize: 16,
    color: '#000',
  },
  createButton: {
    backgroundColor: '#C8C8C8',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    width: '50%',
    marginTop: 10,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
});
