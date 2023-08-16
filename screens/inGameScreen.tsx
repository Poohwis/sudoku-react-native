import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { Grid } from "../src/components/Table/grid";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParams } from "../navigation/navigation";
import { TEMP } from "../src/components/Quiz/temp";

type Props = NativeStackScreenProps<RootStackParams, "InGame">;

export default function InGameScreen({ route }: Props) {
  const variation: number = route.params.variation;
  const data = TEMP.filter((data) => data.id === variation)[0];

  return (
    <>
      <GestureHandlerRootView style={styles.container}>
        <Grid data={data} />
      </GestureHandlerRootView>
      {/* <Numpad /> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
