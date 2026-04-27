import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
  Modal,
} from 'react-native';
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';
import { useAppTheme } from '@/contexts/theme-context';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

export function Sidebar({ visible, onClose }: SidebarProps) {
  const slideAnim = useRef(new Animated.Value(-280)).current;
  const { displayName, email, signOut, role } = useAuth();
  const { colors } = useAppTheme();
  const router = useRouter();

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -280,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible, slideAnim]);

  const handleLogOut = async () => {
    onClose();
    await signOut();
    router.replace('/login');
  };

  const handleCreateWorkSpace = () => {
    onClose();
    router.push('/create-workspace');
  };

  const handleAllWorkSpaces = () => {
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={[styles.overlay, { backgroundColor: colors.modalBackdrop }]} onPress={onClose}>
        <Animated.View
          style={[styles.sidebar, { backgroundColor: colors.surface, transform: [{ translateX: slideAnim }] }]}>
          <View style={styles.profileSection}>
            <View style={[styles.avatar, { backgroundColor: colors.border }]}>
              <Text style={[styles.avatarText, { color: colors.text }]}>{getInitials(displayName || 'U')}</Text>
            </View>
            <Text style={[styles.displayName, { color: colors.text }]}>{displayName || 'Display Name'}</Text>
            <Text style={[styles.email, { color: colors.textSecondary }]}>{email || 'useremail@email.com'}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.menuSection}>
            {role !== 'merchant-seller' && (
              <TouchableOpacity style={styles.menuItem} onPress={handleCreateWorkSpace}>
                <Text style={[styles.menuIcon, { color: colors.text }]}>+</Text>
                <Text style={[styles.menuText, { color: colors.text }]}>Create Work Space</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.menuItem} onPress={handleAllWorkSpaces}>
              <Text style={[styles.menuIcon, { color: colors.text }]}>&#128196;</Text>
              <Text style={[styles.menuText, { color: colors.text }]}>All Work Spaces</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); router.push('/join-workspace'); }}>
              <Text style={[styles.menuIcon, { color: colors.text }]}>&#128229;</Text>
              <Text style={[styles.menuText, { color: colors.text }]}>Join Work Space</Text>
            </TouchableOpacity>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); router.push('/settings'); }}>
              <Text style={[styles.menuIcon, { color: colors.text }]}>&#9881;</Text>
              <Text style={[styles.menuText, { color: colors.text }]}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogOut}>
              <Text style={[styles.menuIcon, { color: colors.text }]}>&#10132;</Text>
              <Text style={[styles.menuText, { color: colors.text }]}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    paddingTop: 70,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
  },
  displayName: {
    fontSize: 18,
    fontWeight: '600',
  },
  email: {
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  menuSection: {
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    gap: 14,
  },
  menuIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
