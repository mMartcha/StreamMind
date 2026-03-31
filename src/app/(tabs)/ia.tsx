import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { AppText, PosterCard, Screen, SectionHeader } from '@/src/components';
import { aiConversation, contentLibrary } from '@/src/data/content';
import { theme } from '@/theme';

export default function AIScreen() {
  return (
    <Screen scroll={false}>
      <View style={styles.container}>
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}>
          <SectionHeader
            title="Assistente AI"
            subtitle="Peca recomendacoes em linguagem natural. O app sugere, organiza e leva voce para os detalhes."
          />

          <View style={styles.chatShell}>
            {aiConversation.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageRow,
                  message.role === 'user' ? styles.userRow : styles.assistantRow,
                ]}>
                {message.role === 'assistant' ? (
                  <View style={styles.assistantIcon}>
                    <Ionicons name="sparkles" size={16} color={theme.colors.primarySoft} />
                  </View>
                ) : null}
                <View
                  style={[
                    styles.bubble,
                    message.role === 'user' ? styles.userBubble : styles.assistantBubble,
                  ]}>
                  <AppText style={styles.bubbleText}>{message.text}</AppText>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.pickList}>
            {aiConversation
              .flatMap((message) => message.picks ?? [])
              .map((pickId) => contentLibrary.find((item) => item.id === pickId))
              .filter(Boolean)
              .map((item) => (
                <PosterCard key={item!.id} item={item!} compact />
              ))}
          </View>

          <AppText style={styles.footnote}>
            O StreamMind recomenda e direciona voce para plataformas externas. O app nao reproduz conteudo.
          </AppText>
        </ScrollView>

        <View style={styles.inputBarWrap}>
          <View style={styles.inputBar}>
            <Ionicons name="sparkles" size={18} color={theme.colors.primarySoft} />
            <TextInput
              editable={false}
              placeholder="Ex: quero algo leve, curto e para ver em casal"
              placeholderTextColor={theme.colors.textSoft}
              style={styles.input}
            />
          </View>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.top,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  chatShell: {
    gap: 12,
  },
  messageRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-end',
  },
  assistantRow: {
    justifyContent: 'flex-start',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  assistantIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#21112f',
    borderWidth: 1,
    borderColor: '#8A2BE244',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: theme.radius.lg,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
  },
  assistantBubble: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  userBubble: {
    backgroundColor: '#29163d',
    borderColor: '#8A2BE255',
  },
  bubbleText: {
    color: theme.colors.text,
    fontSize: theme.fonts.md,
    lineHeight: 22,
  },
  pickList: {
    gap: theme.spacing.md,
  },
  inputBarWrap: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    paddingTop: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    flex: 1,
    color: theme.colors.text,
    fontSize: theme.fonts.sm,
    fontFamily: theme.fonts.family.regular,
  },
  footnote: {
    color: theme.colors.textSoft,
    fontSize: theme.fonts.sm,
    lineHeight: 22,
  },
});
