import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Mail, Lock, User } from 'lucide-react-native';
import * as SecureStore from 'expo-secure-store';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [pubkey, setPubkey] = useState('');
  const [privKey, setPrivkey] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      setError('');

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const authData = {
        name,
        pubkey,
        privKey,
        password,
      };

      await SecureStore.setItemAsync('auth', JSON.stringify(authData));
      
      // Navigate to main app
    } catch (err) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <User size={20} color="#8E99A4" />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#8E99A4"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color="#8E99A4" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#8E99A4"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color="#8E99A4" />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#8E99A4"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>

          <Pressable style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Create Account</Text>
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/login" asChild>
              <Pressable>
                <Text style={styles.footerLink}>Sign In</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1621',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E99A4',
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#17212B',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2AABEE',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#8E99A4',
    fontSize: 14,
  },
  footerLink: {
    color: '#2AABEE',
    fontSize: 14,
    fontWeight: '600',
  },
  error: {
    color: '#FF5252',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
});