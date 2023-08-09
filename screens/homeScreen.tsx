import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Text, View , TouchableOpacity} from "react-native";
import { RootStackParams } from "../navigation/navigation";

export default function HomeScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParams>>();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to home!!</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("InGame", {variation: 1})}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Variation1</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("InGame",{variation: 2})}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Variation2</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    justifyContent: "center",
    // alignItems: "center",
  },
  text: {
    fontSize: 20,
    color: "white",
    textAlign: "center",
  },
  button: {
    paddingVertical: 10,
    backgroundColor: "teal",
    borderRadius: 10,
    marginHorizontal: 50,
    alignItems: "center",
    marginTop: 40,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
  },
});
