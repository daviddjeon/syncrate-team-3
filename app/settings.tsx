import { View, Text, TouchableOpacity, StyleSheet, Switch, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';
import { useAppTheme } from '@/contexts/theme-context';

interface SettingRowProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  textColor: string;
  descColor: string;
}

function SettingRow({ label, description, value, onValueChange, textColor, descColor }: SettingRowProps) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingLabel, { color: textColor }]}>{label}</Text>
        {description ? <Text style={[styles.settingDesc, { color: descColor }]}>{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#CCC', true: '#555' }}
        thumbColor="#FFF"
      />
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { isDark, setDark, colors } = useAppTheme();

  const [language, setLanguage] = useState(false);
  const [setting1, setSetting1] = useState(false);
  const [setting2, setSetting2] = useState(false);
  const [setting3, setSetting3] = useState(false);

  const handleLogOut = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={[styles.menuIcon, { color: colors.icon }]}>&#9776;</Text>
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

      <ScrollView style={styles.settingsList} contentContainerStyle={styles.settingsContent}>
        <SettingRow label="Dark Mode" value={isDark} onValueChange={setDark} textColor={colors.text} descColor={colors.textSecondary} />
        <SettingRow label="Language" value={language} onValueChange={setLanguage} textColor={colors.text} descColor={colors.textSecondary} />
        <SettingRow label="Label" description="Description" value={setting1} onValueChange={setSetting1} textColor={colors.text} descColor={colors.textSecondary} />
        <SettingRow label="Label" description="Description" value={setting2} onValueChange={setSetting2} textColor={colors.text} descColor={colors.textSecondary} />
        <SettingRow label="Label" description="Description" value={setting3} onValueChange={setSetting3} textColor={colors.text} descColor={colors.textSecondary} />
      </ScrollView>

      <View style={[styles.bottomSection, { borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.logOutRow} onPress={handleLogOut}>
          <Text style={[styles.logOutIcon, { color: colors.textSecondary }]}>&#10132;</Text>
          <Text style={[styles.logOutText, { color: colors.text }]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  menuIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
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
  },
  settingDesc: {
    fontSize: 13,
    marginTop: 2,
  },
  bottomSection: {
    borderTopWidth: 1,
    paddingTop: 16,
  },
  logOutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  logOutIcon: {
    fontSize: 20,
  },
  logOutText: {
    fontSize: 17,
    fontWeight: '500',
  },
});
