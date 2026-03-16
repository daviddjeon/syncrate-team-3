import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';

interface SettingRowProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
}

function SettingRow({ label, description, value, onValueChange }: SettingRowProps) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        {description ? <Text style={styles.settingDesc}>{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#CCC', true: '#333' }}
        thumbColor="#FFF"
      />
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();

  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState(false);
  const [setting1, setSetting1] = useState(false);
  const [setting2, setSetting2] = useState(false);
  const [setting3, setSetting3] = useState(false);

  const handleLogOut = () => {
    signOut();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.menuIcon}>&#9776;</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Settings</Text>

      <ScrollView style={styles.settingsList} contentContainerStyle={styles.settingsContent}>
        <SettingRow label="Dark Mode" value={darkMode} onValueChange={setDarkMode} />
        <SettingRow label="Language" value={language} onValueChange={setLanguage} />
        <SettingRow label="Label" description="Description" value={setting1} onValueChange={setSetting1} />
        <SettingRow label="Label" description="Description" value={setting2} onValueChange={setSetting2} />
        <SettingRow label="Label" description="Description" value={setting3} onValueChange={setSetting3} />
      </ScrollView>

      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.logOutRow} onPress={handleLogOut}>
          <Text style={styles.logOutIcon}>&#10132;</Text>
          <Text style={styles.logOutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  menuIcon: {
    fontSize: 28,
    color: '#000',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
    marginBottom: 30,
  },
  settingsList: {
    flex: 1,
  },
  settingsContent: {
    gap: 8,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000',
  },
  settingDesc: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: '#CCC',
    paddingTop: 16,
  },
  logOutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  logOutIcon: {
    fontSize: 20,
    color: '#333',
  },
  logOutText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#000',
  },
});
