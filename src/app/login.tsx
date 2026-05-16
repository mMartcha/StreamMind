import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { AppText, Screen } from '@/src/components';
import { useAuth } from '@/src/contexts/AuthContext';
import { theme } from '@/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    try {
      setIsSubmitting(true);
      setError(null);
      await signIn(email.trim(), password);
      router.replace('/(tabs)');
    } catch {
      setError('Email ou senha invalidos.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Screen>
      <View style={styles.header}>
        <AppText style={styles.brand}>
          Stream<AppText style={styles.innerBrand}>Mind</AppText>
        </AppText>
        <AppText style={styles.subtitle}>Entre para acessar suas listas e preferências.</AppText>
      </View>

      <View style={styles.form}>
        <View style={styles.field}>
          <AppText style={styles.label}>Email</AppText>
          <TextInput
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="seu@email.com"
            placeholderTextColor={theme.colors.textSoft}
            style={styles.input}
            value={email}
          />
        </View>

        <View style={styles.field}>
          <AppText style={styles.label}>Senha</AppText>
          <TextInput
            onChangeText={setPassword}
            placeholder="Sua senha"
            placeholderTextColor={theme.colors.textSoft}
            secureTextEntry
            style={styles.input}
            value={password}
          />
        </View>

        {error && <AppText style={styles.error}>{error}</AppText>}

        <Pressable
          disabled={isSubmitting}
          onPress={handleSubmit}
          style={[styles.button, isSubmitting && styles.buttonDisabled]}>
          {isSubmitting ? (
            <ActivityIndicator color="#111" />
          ) : (
            <AppText style={styles.buttonText}>Entrar</AppText>
          )}
        </Pressable>

        <Link href="/register" asChild>
          <Pressable style={styles.linkButton}>
            <AppText style={styles.linkText}>Ainda não tenho conta</AppText>
          </Pressable>
        </Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
    marginTop: 32,
  },
  brand: {
    alignSelf: 'center',
    color: theme.colors.primary,
    fontSize: 34,
  },
  innerBrand: {
    color: theme.colors.primary,
    fontSize: 34,
    fontFamily: theme.fonts.family.bold,
  },
  subtitle: {
    color: theme.colors.textMuted,
    fontSize: theme.fonts.sm,
    textAlign: 'center',
  },
  form: {
    gap: theme.spacing.md,
  },
  field: {
    gap: 8,
  },
  label: {
    color: theme.colors.text,
    fontSize: theme.fonts.sm,
    fontFamily: theme.fonts.family.semibold,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    color: theme.colors.text,
    fontFamily: theme.fonts.family.regular,
    fontSize: theme.fonts.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.pill,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: theme.spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#111',
    fontSize: theme.fonts.md,
    fontFamily: theme.fonts.family.bold,
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkText: {
    color: theme.colors.primarySoft,
    fontSize: theme.fonts.sm,
    fontFamily: theme.fonts.family.semibold,
  },
  error: {
    color: theme.colors.danger,
    fontSize: theme.fonts.sm,
  },
});
