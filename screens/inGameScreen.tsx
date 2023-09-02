import { useState, useCallback, useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, Dimensions } from "react-native";
import { Grid } from "../src/components/Table/grid";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParams } from "../navigation/navigation";
import { TEMP } from "../src/components/Quiz/temp";
import { NumPad } from "../src/components/Table/numpad";
import { NoteGrid } from "../src/components/Table/notegrid";

type Props = NativeStackScreenProps<RootStackParams, "InGame">;

const { width: SCREEN_WIDTH } = Dimensions.get("screen");
const CELL_RATIO = 0.99;
const CELL_SIZE = Math.floor((SCREEN_WIDTH / 9) * CELL_RATIO);

export default function InGameScreen({ route }: Props) {
  const variation: number = route.params.variation;
  const data = TEMP.filter((data) => data.id === variation)[0];

  const [isEasyMode, setIsEasyMode] = useState<boolean>(false);
  const [isNoteMode, setIsNoteMode] = useState<boolean>(false);
  const [pressedNum, setPressedNum] = useState<number | undefined>(undefined);

  const noteObj = Object.fromEntries(
    Array.from({ length: 9 }, (_, index) => [index + 1, false])
  );

  const noteArray = new Array(9).fill(0).map(() => new Array(9).fill(noteObj));
  const [currentNote, setCurrentNote] =
    useState<Record<string, boolean>[][]>(noteArray);

  const handleNoteModeToggle = useCallback(() => {
    setIsNoteMode(!isNoteMode);
  }, [isNoteMode]);

  const handleEasyModeToggle = useCallback(() => {
    setIsEasyMode(!isEasyMode);
  }, [isEasyMode])

  return (
    <>
      <GestureHandlerRootView style={styles.container}>
        <Grid
          data={data}
          isNoteMode={isNoteMode}
          pressedNum={pressedNum}
          setPressedNum={setPressedNum}
          cellSize={CELL_SIZE}
          currentNote={currentNote}
          setCurrentNote={setCurrentNote}
          isEasyMode={isEasyMode}
        />
      </GestureHandlerRootView>
      {/* <NumPad
        isNoteMode={isNoteMode}
        handleNoteModeToggle={handleNoteModeToggle}
        setPressedNum={setPressedNum}
        isEasyMode={isEasyMode}
        handleEasyModeToggle={handleEasyModeToggle}
      /> */}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red'
  },
});
