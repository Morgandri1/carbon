import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { MessageCircle, Phone, Video, Bell, Blocks as Block } from 'lucide-react-native';

export default function ProfileScreen() {
  const { id } = useLocalSearchParams();

  const DUMMY_USER = {
    name: 'John Doe',
    username: '@johndoe',
    bio: 'Software Developer | Coffee Lover | Tech Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    phone: '+1 234 567 8900',
    status: 'online',
  };

  const ACTIONS = [
    { icon: MessageCircle, label: 'Send Message', color: '#2AABEE' },
    { icon: Phone, label: 'Voice Call', color: '#4CAF50' },
    { icon: Video, label: 'Video Call', color: '#9C27B0' },
    { icon: Bell, label: 'Mute', color: '#FF9800' },
    { icon: Block, label: 'Block', color: '#FF5252' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: DUMMY_USER.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{DUMMY_USER.name}</Text>
        <Text style={styles.username}>{DUMMY_USER.username}</Text>
        <View style={[styles.statusContainer, { backgroundColor: DUMMY_USER.status === 'online' ? '#4CAF50' : '#8E99A4' }]}>
          <Text style={styles.statusText}>{DUMMY_USER.status}</Text>
        </View>
      </View>

      <View style={styles.bioSection}>
        <Text style={styles.bioTitle}>About</Text>
        <Text style={styles.bioText}>{DUMMY_USER.bio}</Text>
      </View>

      <View style={styles.actionsContainer}>
        {ACTIONS.map((action, index) => (
          <Pressable key={index} style={styles.actionButton}>
            <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
              <action.icon size={24} color={action.color} />
            </View>
            <Text style={styles.actionLabel}>{action.label}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1621',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1C2733',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#8E99A4',
    marginBottom: 8,
  },
  statusContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  bioSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1C2733',
  },
  bioTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    color: '#8E99A4',
    lineHeight: 20,
  },
  actionsContainer: {
    padding: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#17212B',
    borderRadius: 12,
    marginBottom: 8,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionLabel: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});