import { theme } from "@/theme";
import { StyleSheet, View } from "react-native";

export default function HeaderText() {
    return (
        <View style={styles.header}>
        </View>
    )
}
const styles = StyleSheet.create({
  header: {
    gap: 8,
    backgroundColor:'#17002f',
    flex:1
  },
  brand: {
    color: theme.colors.primary,
    fontSize: 34,
    fontWeight: theme.fonts.bold,
  },
  
});
