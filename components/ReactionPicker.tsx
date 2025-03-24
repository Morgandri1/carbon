import { View, Pressable, StyleSheet } from 'react-native';
import { Heart, ThumbsUp, Laugh, Angry, Salad as Sad } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const REACTIONS = [
  { icon: ThumbsUp, color: '#2AABEE', name: 'like' },
  { icon: Heart, color: '#FF4B4B', name: 'love' },
  { icon: Laugh, color: '#FFD93D', name: 'haha' },
  { icon: Sad, color: '#8E99A4', name: 'sad' },
  { icon: Angry, color: '#FF6B6B', name: 'angry' },
];

export function ReactionPicker({ 
  onReact,
  visible,
}: { 
  onReact: (reaction: string) => void;
  visible: boolean;
}) {
  if (!visible) return null;

  return (
    <Animated.View 
      entering={FadeIn.duration(350)}
      exiting={FadeOut.duration(350)}
      style={styles.container}
    >
      {REACTIONS.map((reaction) => (
        <Pressable
          key={reaction.name}
          style={styles.reactionButton}
          onPress={() => onReact(reaction.name)}
        >
          <reaction.icon size={24} color={reaction.color} />
        </Pressable>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1C2733',
    borderRadius: 20,
    padding: 4,
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: [{ translateX: -120 }],
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  reactionButton: {
    padding: 8,
    borderRadius: 16,
  },
});