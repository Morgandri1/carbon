import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'expo-router';
import { Users } from 'lucide-react-native';
import { Chat } from '@/lib/types';

const DUMMY_CHATS = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: {content: 'Hey, how are you?'},
    created: new Date(Date.now() - 1000 * 60 * 5).getTime(),
    logo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    unread: 2,
    members: ["", "", "", ""],
    symetric_keys: [],
    admins: [],
    description: "",
    pins: [],
    broadcast: false,
    private: true
  },
  {
    id: '2',
    name: 'Design Team',
    lastMessage: {content: 'New project updates'},
    created: new Date(Date.now() - 1000 * 60 * 30).getTime(),
    logo: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop',
    unread: 5,
    members: ["", "", "", ""],
    symetric_keys: [],
    admins: [],
    description: "",
    pins: [],
    broadcast: false,
    private: true
  },
  {
    id: '3',
    name: 'Jane Smith',
    lastMessage: {content: '📎 Project Brief.pdf'},
    created: new Date(Date.now() - 1000 * 60 * 60).getTime(),
    logo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    unread: 0,
    members: ["", "", "", ""],
    symetric_keys: [],
    admins: [],
    description: "",
    pins: [],
    broadcast: false,
    private: true
  },
  {
    id: '4',
    name: 'Marketing Team',
    lastMessage: {content: '🎤 Voice message (0:30)'},
    created: new Date(Date.now() - 1000 * 60 * 120).getTime(),
    logo: 'https://images.unsplash.com/photo-1543269664-76bc3997d9ea?w=400&h=400&fit=crop',
    unread: 3,
    members: ["", "", "", ""],
    symetric_keys: [],
    admins: [],
    description: "",
    pins: [],
    broadcast: false,
    private: true
  },
] as Chat[];

export default function ChatsScreen() {
  const renderItem = ({ item }: { item: Chat }) => (
    <Link href={`/chat/${item.id}`} asChild>
      <Pressable style={styles.chatItem}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.logo }} style={styles.avatar} />
          {item.members.length > 2 && (
            <View style={styles.groupIndicator}>
              <Users size={12} color="#FFFFFF" />
            </View>
          )}
        </View>
        <View style={styles.chatInfo}>
          <View style={styles.chatHeader}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.timestamp}>
              {formatDistanceToNow(item.created, { addSuffix: true })}
            </Text>
          </View>
          <View style={styles.messageContainer}>
            <Text style={styles.lastMessage} numberOfLines={1}>
              {item.lastMessage?.content}
            </Text>
            {item.unread && item.unread > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unread}</Text>
              </View>
            )}
          </View>
          {item.members.length > 2 && (
            <Text style={styles.memberCount}>
              {item.members.length} members
            </Text>
          )}
        </View>
      </Pressable>
    </Link>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={DUMMY_CHATS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1621',
  },
  listContent: {
    paddingVertical: 8,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  groupIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2AABEE',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  timestamp: {
    fontSize: 12,
    color: '#8E99A4',
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#8E99A4',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#2AABEE',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  memberCount: {
    fontSize: 12,
    color: '#8E99A4',
    marginTop: 2,
  },
});