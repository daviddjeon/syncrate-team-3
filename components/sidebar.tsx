import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';

const SIDEBAR_WIDTH = Dimensions.get('window').width * 0.7;

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function Sidebar({ visible, onClose }: SidebarProps) {
  const { displayName, email, signOut } = useAuth();
  const router = useRouter();
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: visible ? 0 : -SIDEBAR_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [visible, slideAnim]);

  const handleLogOut = () => {
    onClose();
    signOut();
    router.replace('/');
  };

  const handleCreateWorkSpace = () => {
    onClose();
    router.push('/create-workspace');
  };

  const handleAllWorkSpaces = () => {
    onClose();
    // Already on the spaces screen
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <Animated.View
          style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(displayName || 'U')}</Text>
            </View>
            <Text style={styles.displayName}>{displayName || 'Display Name'}</Text>
            <Text style={styles.email}>{email || 'useremail@email.com'}</Text>
          </View>

          <View style={styles.divider} />

          {/* Menu Items */}
          <View style={styles.menuSection}>
            <TouchableOpacity style={styles.menuItem} onPress={handleCreateWorkSpace}>
              <Text style={styles.menuIcon}>+</Text>
              <Text style={styles.menuText}>Create Work Space</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleAllWorkSpaces}>
              <Text style={styles.menuIcon}>&#128196;</Text>
              <Text style={styles.menuText}>All Work Spaces</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); router.push('/join-workspace'); }}>
              <Text style={styles.menuIcon}>&#128229;</Text>
              <Text style={styles.menuText}>Join Work Space</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Section */}
          <View style={styles.bottomSection}>
            <TouchableOpacity style={styles.menuItem} onPress={() => { onClose(); router.push('/settings'); }}>
              <Text style={styles.menuIcon}>&#9881;</Text>
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogOut}>
              <Text style={styles.menuIcon}>&#10132;</Text>
              <Text style={styles.menuText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sidebar: {
    width: SIDEBAR_WIDTH,
    backgroundColor: '#F2F2F2',
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: 'flex-start',
    height: '100%',
  },
  profileSection: {
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#666',
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  displayName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#CCC',
    marginVertical: 12,
  },
  menuSection: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  menuIcon: {
    fontSize: 20,
    width: 28,
    textAlign: 'center',
    color: '#333',
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  bottomSection: {
    borderTopWidth: 1,
    borderTopColor: '#CCC',
    paddingTop: 8,
  },
});
