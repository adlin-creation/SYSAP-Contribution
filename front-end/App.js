import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import SectionHautComponent from "./components/SectionHautComponent";

export default function App() {
  return (
    <View style={styles.container}>
      <SectionHautComponent sessionsCompleted={6} totalSessions={10} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
