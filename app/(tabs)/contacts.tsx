import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';

const DUMMY_CONTACTS = [
  {
    id: '1',
    name: 'John Doe',
    username: '@johndoe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    status: 'online',
  },
  {
    id: '2',
    name: 'Jane Smith',
    username: '@janesmith',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    status: 'offline',
  },
];

export default function ContactsScreen() {
  const renderItem = ({ item }) => (
    <Link href={`/profile/${item.id}`} asChild>
      <Pressable style={styles.contactItem}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.contactInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.username}>{item.username}</Text>
        </View>
        <View style={[styles.statusDot, { backgroundColor: item.status === 'online' ? '#4CAF50' : '#8E99A4' }]} />
      </Pressable>
    </Link>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={DUMMY_CONTACTS}
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
  contactItem: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  username: {
    fontSize: 14,
    color: '#8E99A4',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
});