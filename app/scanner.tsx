import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useState, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useInventory } from '@/contexts/inventory-context';
import { useAuth } from '@/contexts/auth-context';
import { useAppTheme } from '@/contexts/theme-context';

export default function ScannerScreen() {
  const router = useRouter();
  const { spaceName, workspaceId } = useLocalSearchParams<{ spaceName: string; workspaceId: string }>();
  const { addItem } = useInventory();
  const { displayName } = useAuth();
  const { colors } = useAppTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState('');
  const [position, setPosition] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={[styles.container, { backgroundColor: colors.background }]} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backIcon, { color: colors.icon }]}>&#8249;</Text>
        </TouchableOpacity>
        <Text style={[styles.permissionText, { color: colors.text }]}>Camera permission is required to scan barcodes.</Text>
        <TouchableOpacity style={[styles.permissionButton, { backgroundColor: colors.buttonBg }]} onPress={requestPermission}>
          <Text style={[styles.permissionButtonText, { color: colors.buttonText }]}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scannedCode) {
      setScannedCode(data);
    }
  };

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      const result = await cameraRef.current.takePictureAsync();
      if (result) {
        setPhoto(result.uri);
      }
    }
  };

  const handleUploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleAddToInventory = () => {
    if (!scannedCode || !workspaceId) return;
    addItem(workspaceId, {
      sku: scannedCode,
      num: 1,
      timeScanned: new Date().toISOString(),
      scannedBy: displayName || 'Unknown',
      positions: position ? [{ name: position, count: 1 }] : [],
      picture: photo,
      descriptions: description,
    });
    router.back();
  };

  // Camera scanning view (before barcode is scanned)
  if (!scannedCode) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={[styles.backIcon, { color: colors.icon }]}>&#8249;</Text>
        </TouchableOpacity>

        <View style={[styles.scanArea, { borderColor: colors.border }]}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            barcodeScannerSettings={{
              barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39', 'upc_a'],
            }}
            onBarcodeScanned={handleBarCodeScanned}
          />
        </View>

        <Text style={[styles.scanHint, { color: colors.textSecondary }]}>Point camera at a barcode to scan</Text>
      </View>
    );
  }

  // Scanned result form view
  return (
    <ScrollView style={[styles.scroll, { backgroundColor: colors.background }]} contentContainerStyle={styles.formContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={[styles.backIcon, { color: colors.icon }]}>&#8249;</Text>
      </TouchableOpacity>

      {/* Scanned SKU */}
      <View style={[styles.skuRow, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}>
        <Text style={[styles.skuText, { color: colors.text }]}>{scannedCode}</Text>
        <TouchableOpacity onPress={() => setScannedCode('')}>
          <Text style={[styles.editIcon, { color: colors.textSecondary }]}>&#9998;</Text>
        </TouchableOpacity>
      </View>

      {/* Add Position */}
      <Text style={[styles.sectionLabel, { color: colors.text }]}>Add Position</Text>
      <TextInput
        style={[styles.input, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
        value={position}
        onChangeText={setPosition}
        placeholderTextColor={colors.textSecondary}
      />

      {/* Add Description */}
      <Text style={[styles.sectionLabel, { color: colors.text }]}>Add Description</Text>
      <TextInput
        style={[styles.input, styles.textArea, { backgroundColor: colors.surfaceAlt, borderColor: colors.border, color: colors.text }]}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        placeholderTextColor={colors.textSecondary}
      />

      {/* Add Photo */}
      <Text style={[styles.sectionLabel, { color: colors.text }]}>Add Photo</Text>
      <TouchableOpacity style={[styles.photoButton, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]} onPress={handleTakePhoto}>
        <Text style={[styles.photoButtonIcon, { color: colors.textSecondary }]}>&#128247;</Text>
        <Text style={[styles.photoButtonText, { color: colors.textSecondary }]}>take photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.photoButton, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]} onPress={handleUploadImage}>
        <Text style={[styles.photoButtonIcon, { color: colors.textSecondary }]}>&#9998;</Text>
        <Text style={[styles.photoButtonText, { color: colors.textSecondary }]}>upload image</Text>
      </TouchableOpacity>

      {photo ? (
        <Text style={styles.photoSelected}>Image selected</Text>
      ) : null}

      {/* Add to Inventory */}
      <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.buttonBg, borderColor: colors.border }]} onPress={handleAddToInventory}>
        <Text style={[styles.addButtonText, { color: colors.buttonText }]}>Add to Inventory</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 56,
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
  formContainer: {
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 50,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backIcon: {
    fontSize: 36,
    fontWeight: '300',
    lineHeight: 36,
  },
  scanArea: {
    width: '90%',
    height: 200,
    borderWidth: 1,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  scanHint: {
    fontSize: 15,
    marginTop: 10,
  },
  skuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'center',
    gap: 10,
    marginBottom: 20,
    borderWidth: 1,
  },
  skuText: {
    fontSize: 16,
    fontWeight: '600',
  },
  editIcon: {
    fontSize: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
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
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  photoButtonIcon: {
    fontSize: 14,
  },
  photoButtonText: {
    fontSize: 14,
  },
  photoSelected: {
    fontSize: 13,
    color: '#4CAF50',
    marginTop: 4,
    marginBottom: 8,
  },
  addButton: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginTop: 30,
    borderWidth: 1,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  permissionButton: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
