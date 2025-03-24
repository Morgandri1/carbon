import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Image as ImageIcon, File, X } from 'lucide-react-native';
import { Attachment } from '@/lib/types';

export function MediaPicker({ 
  onMediaSelect,
  onRemove,
  selectedMedia
}: { 
  onMediaSelect: (media: Attachment) => void;
  onRemove: () => void;
  selectedMedia?: { uri: string; type: string; filename: string } | null;
}) {
  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      onMediaSelect({
        uri: asset.uri,
        type: asset.type || 'image',
        filename: asset.fileName || 'image',
      });
    }
  }

  async function pickDocument() {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (result.assets && result.assets[0]) {
      const asset = result.assets[0];
      onMediaSelect({
        uri: asset.uri,
        type: 'file',
        filename: asset.name,
      });
    }
  }

  return (
    <View style={styles.container}>
      {selectedMedia ? (
        <View style={styles.previewContainer}>
          {selectedMedia.type.startsWith('image') ? (
            <Image
              source={{ uri: selectedMedia.uri }}
              style={styles.imagePreview}
              contentFit="cover"
            />
          ) : (
            <View style={styles.filePreview}>
              <File size={24} color="#8E99A4" />
              <Text style={styles.fileName} numberOfLines={1}>
                {selectedMedia.filename}
              </Text>
            </View>
          )}
          <Pressable style={styles.removeButton} onPress={onRemove}>
            <X size={20} color="#FFFFFF" />
          </Pressable>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={pickImage}>
            <ImageIcon size={24} color="#2AABEE" />
            <Text style={styles.buttonText}>Photo/Video</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={pickDocument}>
            <File size={24} color="#2AABEE" />
            <Text style={styles.buttonText}>Document</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C2733',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  buttonText: {
    color: '#2AABEE',
    fontSize: 14,
    fontWeight: '600',
  },
  previewContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    backgroundColor: '#1C2733',
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C2733',
    padding: 16,
    gap: 8,
  },
  fileName: {
    color: '#FFFFFF',
    fontSize: 14,
    flex: 1,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});