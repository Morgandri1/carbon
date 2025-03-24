import React from 'react';
import { TouchableOpacity, Text, View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';

const ChatHeader = ({ chatName, chatId }: { chatName: string, chatId: string }) => {
    const navigation = useNavigation();

    return (
        <Link
          href={
            { pathname: `/chat/[${chatId}]` as '/chat/[id]', params: { id: chatId, chatName } }
          }
          style={styles.container}
        >
            <Link style={styles.avatar} href={
              { pathname: `/chat/[${chatId}]` as '/chat/[id]', params: { id: chatId, chatName } }
            }>
                <View>
                    <Text style={styles.avatarLabel}>
                        {chatName}
                    </Text>
                </View>
            </Link>

            <Text style={styles.chatName}>{chatName}</Text>
        </Link>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        marginLeft: -30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#17212B'
    },
    avatarLabel: {
        fontSize: 20,
        color: 'white'
    },
    chatName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
});

export default ChatHeader;
