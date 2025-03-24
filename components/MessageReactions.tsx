import { View, Text, StyleSheet } from 'react-native';
import { Heart, ThumbsUp, Laugh, Angry, Salad as Sad } from 'lucide-react-native';

const REACTIONS = {
  like: { icon: ThumbsUp, color: '#2AABEE' },
  love: { icon: Heart, color: '#FF4B4B' },
  haha: { icon: Laugh, color: '#FFD93D' },
  sad: { icon: Sad, color: '#8E99A4' },
  angry: { icon: Angry, color: '#FF6B6B' },
};

export function MessageReactions({ 
  reactions = []
}: { 
  reactions: Array<{ emoji: 'like' | 'love' | 'haha' | 'sad' | 'angry'; count: number }>;
}) {
  if (reactions.length === 0) return null;

  return (
    <View style={styles.container}>
      {reactions.map((reaction) => {
        const reactionConfig = REACTIONS[reaction.emoji];
        if (!reactionConfig) return null;
        
        const Icon = reactionConfig.icon;
        
        return (
          <View key={reaction.emoji} style={styles.reactionBubble}>
            <Icon size={14} color={reactionConfig.color} />
            <Text style={styles.reactionCount}>{reaction.count}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    position: 'absolute',
    bottom: '100%',
    right: 0,
    marginBottom: 4,
  },
  reactionBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C2733',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 2,
  },
  reactionCount: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});