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

export default function ScannerScreen() {
  const router = useRouter();
  const { spaceName } = useLocalSearchParams<{ spaceName: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedCode, setScannedCode] = useState('');
  const [position, setPosition] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>&#8249;</Text>
        </TouchableOpacity>
        <Text style={styles.permissionText}>Camera permission is required to scan barcodes.</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
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
    // Will be wired to backend later
    router.back();
  };

  // Camera scanning view (before barcode is scanned)
  if (!scannedCode) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backIcon}>&#8249;</Text>
        </TouchableOpacity>

        <View style={styles.scanArea}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            barcodeScannerSettings={{
              barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39', 'upc_a'],
            }}
            onBarcodeScanned={handleBarCodeScanned}
          />
        </View>

        <Text style={styles.scanHint}>Point camera at a barcode to scan</Text>
      </View>
    );
  }

  // Scanned result form view
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.formContainer}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backIcon}>&#8249;</Text>
      </TouchableOpacity>

      {/* Scanned SKU */}
      <View style={styles.skuRow}>
        <Text style={styles.skuText}>{scannedCode}</Text>
        <TouchableOpacity onPress={() => setScannedCode('')}>
          <Text style={styles.editIcon}>&#9998;</Text>
        </TouchableOpacity>
      </View>

      {/* Add Position */}
      <Text style={styles.sectionLabel}>Add Position</Text>
      <TextInput
        style={styles.input}
        value={position}
        onChangeText={setPosition}
        placeholder=""
      />

      {/* Add Description */}
      <Text style={styles.sectionLabel}>Add Description</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      {/* Add Photo */}
      <Text style={styles.sectionLabel}>Add Photo</Text>
      <TouchableOpacity style={styles.photoButton} onPress={handleTakePhoto}>
        <Text style={styles.photoButtonIcon}>&#128247;</Text>
        <Text style={styles.photoButtonText}>take photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.photoButton} onPress={handleUploadImage}>
        <Text style={styles.photoButtonIcon}>&#9998;</Text>
        <Text style={styles.photoButtonText}>upload image</Text>
      </TouchableOpacity>

      {photo ? (
        <Text style={styles.photoSelected}>Image selected</Text>
      ) : null}

      {/* Add to Inventory */}
      <TouchableOpacity style={styles.addButton} onPress={handleAddToInventory}>
        <Text style={styles.addButtonText}>Add to Inventory</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 20,
    paddingTop: 56,
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F2F2F2',
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
    color: '#000',
    fontWeight: '300',
    lineHeight: 36,
  },
  scanArea: {
    width: '90%',
    height: 200,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  camera: {
    flex: 1,
  },
  scanHint: {
    fontSize: 15,
    color: '#666',
    marginTop: 10,
  },
  // Scanned form styles
  skuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'center',
    gap: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#CCC',
  },
  skuText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  editIcon: {
    fontSize: 16,
    color: '#555',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
    marginTop: 16,
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
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#CCC',
  },
  photoButtonIcon: {
    fontSize: 14,
    color: '#555',
  },
  photoButtonText: {
    fontSize: 14,
    color: '#555',
  },
  photoSelected: {
    fontSize: 13,
    color: '#4CAF50',
    marginTop: 4,
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: '#D0D0D0',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignSelf: 'center',
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#AAA',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  permissionText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: '#C8C8C8',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
