import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { ChevronRight, Bell, Lock, Moon, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';

const SETTINGS_SECTIONS = [
  {
    id: 'notifications',
    title: 'Notifications',
    icon: Bell,
    color: '#2AABEE',
  },
  {
    id: 'privacy',
    title: 'Privacy and Security',
    icon: Lock,
    color: '#4CAF50',
  },
  {
    id: 'appearance',
    title: 'Appearance',
    icon: Moon,
    color: '#9C27B0',
  },
  {
    id: 'help',
    title: 'Help',
    icon: HelpCircle,
    color: '#FF9800',
  },
];

export default function SettingsScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop' }}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>John Doe</Text>
          <Text style={styles.phone}>+1 234 567 8900</Text>
        </View>
      </View>

      <View style={styles.settingsContainer}>
        {SETTINGS_SECTIONS.map((section) => (
          <Pressable key={section.id} style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <section.icon size={24} color={section.color} />
            </View>
            <Text style={styles.settingTitle}>{section.title}</Text>
            <ChevronRight size={20} color="#8E99A4" />
          </Pressable>
        ))}

        <Pressable style={[styles.settingItem, styles.logoutButton]}>
          <View style={styles.settingIcon}>
            <LogOut size={24} color="#FF5252" />
          </View>
          <Text style={[styles.settingTitle, styles.logoutText]}>Log Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1621',
  },
  profileSection: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1C2733',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  profileInfo: {
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: '#8E99A4',
  },
  settingsContainer: {
    paddingTop: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#17212B',
    marginBottom: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C2733',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  logoutButton: {
    marginTop: 16,
  },
  logoutText: {
    color: '#FF5252',
  },
});