import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { Play, Pause, Mic, CircleStop as StopCircle } from 'lucide-react-native';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  useSharedValue,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

export function VoiceRecorder({ onRecordComplete }: { onRecordComplete: (uri: string) => void }) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    if (isRecording) {
      pulseAnim.value = withRepeat(
        withSequence(
          withSpring(1.2),
          withSpring(1)
        ),
        -1
      );
    } else {
      pulseAnim.value = withSpring(1);
    }
  }, [isRecording]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!recording) return;

    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);

    if (uri) {
      onRecordComplete(uri);
    }
  }

  return (
    <View style={styles.recordContainer}>
      <Animated.View style={[styles.recordButton, animatedStyle]}>
        <Pressable
          onPressIn={startRecording}
          onPressOut={stopRecording}
          style={styles.recordButtonInner}
        >
          {isRecording ? (
            <StopCircle size={24} color="#FF4B4B" />
          ) : (
            <Mic size={24} color="#2AABEE" />
          )}
        </Pressable>
      </Animated.View>
      {isRecording && (
        <Text style={styles.recordingText}>Recording...</Text>
      )}
    </View>
  );
}

export function VoiceMessagePlayer({ uri }: { uri: string }) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const progressAnim = useSharedValue(0);

  useEffect(() => {
    loadSound();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [uri]);

  async function loadSound() {
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { progressUpdateIntervalMillis: 100 },
      onPlaybackStatusUpdate
    );
    setSound(sound);
  }

  function onPlaybackStatusUpdate(status: any) {
    if (status.isLoaded) {
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);
      setIsPlaying(status.isPlaying);
      progressAnim.value = withSpring(
        (status.positionMillis || 0) / (status.durationMillis || 1)
      );
    }
  }

  async function togglePlayPause() {
    if (!sound) return;

    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  }

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressAnim.value * 100}%`,
  }));

  return (
    <View style={styles.playerContainer}>
      <Pressable onPress={togglePlayPause} style={styles.playButton}>
        {isPlaying ? (
          <Pause size={20} color="#FFFFFF" />
        ) : (
          <Play size={20} color="#FFFFFF" />
        )}
      </Pressable>
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, progressStyle]} />
      </View>
      <Text style={styles.duration}>
        {Math.floor(position / 1000)}s / {Math.floor(duration / 1000)}s
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  recordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recordButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1C2733',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingText: {
    color: '#FF4B4B',
    fontSize: 14,
  },
  playerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C2733',
    borderRadius: 20,
    padding: 8,
    gap: 8,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2AABEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flex: 1,
    height: 4,
    backgroundColor: '#2A3C4E',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2AABEE',
  },
  duration: {
    color: '#8E99A4',
    fontSize: 12,
    minWidth: 80,
    textAlign: 'right',
  },
});