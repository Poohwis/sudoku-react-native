import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/homeScreen";
import { StatusBar } from "expo-status-bar";
import InGameScreen from "../screens/inGameScreen";

export type RootStackParams = {
  Home: undefined;
  InGame: { variation: number };
};

const RootStack = createNativeStackNavigator<RootStackParams>();

export default function Navigation() {
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName="Home">
        <RootStack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="InGame"
          component={InGameScreen}
          options={{ headerShown: false }}
        />
      </RootStack.Navigator>
      <StatusBar style="light" />
    </NavigationContainer>
  );
}
