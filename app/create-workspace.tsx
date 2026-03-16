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
import { useAppTheme } from '@/contexts/theme-context';

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
  const { colors } = useAppTheme();

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
    <ScrollView style={[styles.scroll, { backgroundColor: colors.background }]} contentContainerStyle={styles.container}>
      <Text style={[styles.screenTitle, { color: colors.text }]}>Create New Work Space</Text>

      <View style={styles.fieldGroup}>
        <Text style={[styles.label, { color: colors.text }]}>
          Name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
          value={name}
          onChangeText={setName}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.priceRow}>
        <Text style={[styles.priceLabel, { color: colors.text }]}>$</Text>
        <TextInput
          style={[styles.priceInput, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
          value={pricePerProduct}
          onChangeText={setPricePerProduct}
          keyboardType="numeric"
          placeholderTextColor={colors.textSecondary}
        />
        <Text style={[styles.priceDesc, { color: colors.textSecondary }]}>/ product (organizing)</Text>
      </View>

      <View style={styles.priceRow}>
        <Text style={[styles.priceLabel, { color: colors.text }]}>$</Text>
        <TextInput
          style={[styles.priceInput, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
          value={pricePerProductPerDay}
          onChangeText={setPricePerProductPerDay}
          keyboardType="numeric"
          placeholderTextColor={colors.textSecondary}
        />
        <Text style={[styles.priceDesc, { color: colors.textSecondary }]}>/ product / day (storage)</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Retailer</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
          value={retailer}
          onChangeText={setRetailer}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          placeholderTextColor={colors.textSecondary}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Display Image</Text>
        <TouchableOpacity style={[styles.uploadButton, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
          <Text style={[styles.uploadButtonText, { color: colors.textSecondary }]}>upload image</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={[styles.label, { color: colors.text }]}>Time Created</Text>
        <View style={[styles.timeBox, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
          <Text style={[styles.timeText, { color: colors.text }]}>{formatDateTime(now)}</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.createButton, { backgroundColor: colors.buttonBg }]} onPress={handleCreate}>
        <Text style={[styles.createButtonText, { color: colors.buttonText }]}>Create</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 50,
    gap: 20,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  required: {
    color: '#E53935',
  },
  input: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    borderWidth: 1,
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
  },
  priceInput: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    width: 70,
    borderWidth: 1,
  },
  priceDesc: {
    fontSize: 14,
  },
  uploadButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  uploadButtonText: {
    fontSize: 14,
  },
  timeBox: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  timeText: {
    fontSize: 16,
  },
  createButton: {
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
  },
});
