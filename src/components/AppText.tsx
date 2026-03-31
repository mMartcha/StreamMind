import { ReactNode } from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';

import { theme } from '@/theme';

type FontWeightKey = Exclude<keyof typeof theme.fonts.family, 'fallback'>;
type FontSizeKey = 'xsm' | 'sm' | 'md' | 'lg' | 'xl';

type AppTextProps = TextProps & {
  children: ReactNode;
  weight?: FontWeightKey;
  size?: FontSizeKey;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export function AppText({
  children,
  weight = 'regular',
  size = 'md',
  color = theme.colors.text,
  style,
  ...props
}: AppTextProps) {
  return (
    <Text
      style={[
        {
          fontFamily: theme.fonts.family[weight],
          fontSize: theme.fonts[size],
          color,
        },
        style,
      ]}
      {...props}>
      {children}
    </Text>
  );
}
