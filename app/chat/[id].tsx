import { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack, Link } from 'expo-router';
import { Video } from 'expo-av';
import { Image } from 'expo-image';
import { Send, Paperclip, Mic, ChevronLeft, Phone, Video as VideoIcon } from 'lucide-react-native';
import { MessageReactions } from '@/components/MessageReactions';
import { VoiceRecorder, VoiceMessagePlayer } from '@/components/VoiceMessage';
import { MediaPicker } from '@/components/MediaPicker';
import { GestureDetector, LongPressGestureHandler } from 'react-native-gesture-handler';
import React from 'react';
import { Attachment, Message } from '@/lib/types';
import { ReactionPicker } from '@/components/ReactionPicker';

const DUMMY_CONTACT = {
  name: 'John Doe',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
  status: 'online',
};

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Attachment | null>(null);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const DUMMY_MESSAGES = [
    {
      id: '1',
      content: 'Hey, how are you?',
      author: 'them',
      created: new Date(Date.now() - 1000 * 60 * 5).getTime(),
      reactions: [],
      edited: false,
      ctx: id
    } as Message,
    {
      id: '2',
      content: 'I\'m good, thanks! Check out this photo from yesterday!',
      author: 'me',
      created: new Date(Date.now() - 1000 * 60 * 4).getTime(),
      attachments: [{
        type: 'image',
        uri: 'https://railway.com/brand/logo-light.png',
        filename: "image.jpg"
      }],
      ctx: id
    } as Message,
    {
      id: '3',
      content: "",
      author: 'them',
      created: new Date(Date.now() - 1000 * 60 * 3).getTime(),
      voiceMessage: 'https://example.com/voice-message.mp3',
      reactions: [],
      edited: false,
      ctx: id
    } as Message,
    {
      id: '4',
      content: 'Here\'s the document you requested',
      author: 'them',
      created: new Date(Date.now() - 1000 * 60 * 2).getTime(),
      attachments: [{
        type: 'file',
        filename: 'Project_Brief.pdf',
        uri: 'https://example.com/document.pdf',
      }],
    } as Message,
  ] as Message[];

  const handleReaction = (messageId: string, reaction: string) => {
    // Handle reaction logic here
    console.log(`Reacting with ${reaction} to message ${messageId}`);
    setShowReactions(null);
  };

  const handleMediaSelect = (media: Attachment) => {
    setSelectedMedia(media);
    setShowMediaPicker(false);
  };

  const handleVoiceMessage = (uri: string) => {
    // Handle voice message logic here
    console.log('Voice message recorded:', uri);
    setShowVoiceRecorder(false);
  };

  const handleLongPress = (messageId: string) => {
    console.log("longpressed ", messageId)
    setShowReactions(messageId);
  };

  const renderMessage = (msg: Message) => (
    <LongPressGestureHandler
      key={msg.id}
      onActivated={() => handleLongPress(msg.id)}
      cancelsTouchesInView
      shouldCancelWhenOutside
      minDurationMs={250}
    >
      <View style={styles.messageWrapper}>
        <ReactionPicker
          visible={showReactions === msg.id}
          onReact={(reaction) => handleReaction(msg.id, reaction)}
        />
        {msg.reactions && msg.reactions?.length > 0 && (
          <MessageReactions reactions={msg.reactions || []} />
        )}
        <View
          style={[
            styles.messageContainer,
            msg.author === 'me' ? styles.sentMessage : styles.receivedMessage,
          ]}
        >
          {msg.content && (
            <Text style={styles.messageText}>{msg.content}</Text>
          )}
          
          {msg.attachments && msg.attachments.map((attachment) => {
            switch (attachment.type) { 
              case 'image': return (
                <Image
                  source={{uri: attachment.uri}}
                  style={styles.messageImage}
                  onError={console.log}
                  onLoad={() => console.log("loaded")}
                  key={attachment.filename}
                  contentFit='cover'
                />
              );
              case 'video': return (
                <Video
                  source={{ uri: attachment.uri }}
                  style={styles.messageImage}
                  key={attachment.filename}
                />
              );
              case 'file': return (
                <View style={styles.fileContainer} key={attachment.filename}>
                  <Text style={styles.fileName}>{attachment.filename}</Text>
                </View>
              );
              case 'audio': return (
                <VoiceMessagePlayer uri={attachment.uri} key={attachment.filename} />
              )
              default: return null;
            }
          })}
  
          <Text style={styles.timestamp}>
            {new Date(msg.created).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
  
          {msg.reactions && (msg.reactions?.length > 0) && (
            <MessageReactions reactions={msg.reactions || []}/>
          )}
        </View>
      </View>
    </LongPressGestureHandler>
  );

  return (
    <>
      <View style={styles.header}>
        <Link href="/" asChild>
          <Pressable style={styles.backButton}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </Pressable>
        </Link>
        <Image source={{ uri: DUMMY_CONTACT.avatar }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{DUMMY_CONTACT.name}</Text>
          <Text style={styles.headerStatus}>{DUMMY_CONTACT.status}</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.headerButton}>
            <Phone size={20} color="#FFFFFF" />
          </Pressable>
          <Pressable style={styles.headerButton}>
            <VideoIcon size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messageList}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {DUMMY_MESSAGES.map(renderMessage)}
        </ScrollView>

        {showMediaPicker && (
          <MediaPicker
            onMediaSelect={handleMediaSelect}
            onRemove={() => setSelectedMedia(null)}
            selectedMedia={selectedMedia}
          />
        )}

        {showVoiceRecorder && (
          <View style={styles.voiceRecorderContainer}>
            <VoiceRecorder onRecordComplete={handleVoiceMessage} />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Pressable
            style={styles.attachButton}
            onPress={() => setShowMediaPicker(!showMediaPicker)}
          >
            <Paperclip size={24} color="#2AABEE" />
          </Pressable>

          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Message"
            placeholderTextColor="#8E99A4"
            multiline
          />

          {message.length === 0 ? (
            <Pressable
              style={styles.sendButton}
              onPress={() => setShowVoiceRecorder(!showVoiceRecorder)}
            >
              <Mic size={24} color="#2AABEE" />
            </Pressable>
          ) : (
            <Pressable style={styles.sendButton}>
              <Send size={24} color="#2AABEE" />
            </Pressable>
          )}
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  messageWrapper: {
    position: 'relative',
    marginVertical: 4,
    alignSelf: 'stretch',
  },
  container: {
    flex: 1,
    backgroundColor: '#0E1621',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#17212B',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
  },
  backButton: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerStatus: {
    fontSize: 12,
    color: '#8E99A4',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1C2733',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageList: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2AABEE',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#17212B',
  },
  messageText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  messageImage: {
    width: 250,
    height: 250,
    borderRadius: 8,
    marginVertical: 4,
  },
  fileContainer: {
    backgroundColor: '#1C2733',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  fileName: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#17212B',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#1C2733',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    color: '#FFFFFF',
    maxHeight: 100,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C2733',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1C2733',
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceRecorderContainer: {
    padding: 16,
    backgroundColor: '#17212B',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridImage: {
    width: '48%',          // approximate for two per row with spacing
    borderRadius: 8,
    marginVertical: 4,
  },
});