import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  LayoutChangeEvent,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  Pressable,
} from "react-native";
import * as Haptics from "expo-haptics";
import { BlurView } from "expo-blur";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { NoteGrid } from "./notegrid";
import { FrontPlane } from "./frontplane";
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import DialWheel from "./dialWheel";
import { haptics } from "../../misc/haptics";
import { GRID_LAYOUT } from "../../misc/gridLayout";

interface CellSize {
  height: number;
  width: number;
}

interface Coordinates {
  x: number;
  y: number;
}

export interface SelectCell {
  row: number;
  col: number;
  value: number;
}

interface Storage {
  id: number;
  puzzle: readonly number[][];
  solution: readonly number[][];
}

interface GridProps {
  data: Storage;
  isNoteMode: boolean;
  pressedNum: number | undefined;
  setPressedNum: (num: number | undefined) => void;
  cellSize: number;
  currentNote: Record<string, boolean>[][];
  setCurrentNote: (data: Record<string, boolean>[][]) => void;
  isEasyMode: boolean;
}

const WHEEL_RATIO = 3.25;

export function Grid({
  data,
  isNoteMode,
  pressedNum,
  setPressedNum,
  cellSize,
  currentNote,
  setCurrentNote,
  isEasyMode,
}: GridProps) {
  const { puzzle, solution } = data;
  const measuredCellSize = useRef<CellSize>();
  const initialGrid = [...puzzle.map((row) => [...row])];
  const isForInput = initialGrid.map((row) => row.map((cell) => cell === 0));
  const [currentFill, setCurrentFill] = useState<number[][]>(initialGrid);
  const [selectCell, setSelectCell] = useState<SelectCell>();
  const WHEEL_SIZE = cellSize * WHEEL_RATIO;
  const [isWheelActive, setIsWheelOpen] = useState<boolean>(false);
  const buttonPositionRef = useRef<Record<string, number>[]>(
    Array(9).fill({ x: 0, y: 0 })
  );

  useEffect(() => {
    if (pressedNum !== undefined) {
      switch (pressedNum) {
        case 0:
          clearFill();
          clearNote();
          break;
        default:
          if (!isNoteMode) {
            clearNote();
            handleInputNumber();
            // console.log("Normal\n ------------------");
          } else {
            handleInputNote();
            // console.log("Note\n ------------------");
          }
      }
    }
    setPressedNum(undefined);
  }, [pressedNum]);

  const handleInputNumber = () => {
    if (
      selectCell !== undefined &&
      isForInput[selectCell.row][selectCell.col] &&
      pressedNum !== undefined
    ) {
      const updatedValue = [...currentFill.map((row) => [...row])];
      updatedValue[selectCell.row][selectCell.col] = pressedNum;
      setCurrentFill(updatedValue);
      setSelectCell({
        row: selectCell.row,
        col: selectCell.col,
        value: pressedNum,
      });
    }
  };

  const handleInputNote = () => {
    if (
      selectCell !== undefined &&
      isForInput[selectCell.row][selectCell.col] &&
      currentFill[selectCell.row][selectCell.col] === 0 &&
      pressedNum !== undefined
    ) {
      const updatedNote = [...currentNote.map((row) => [...row])];
      const padString = pressedNum.toString();
      updatedNote[selectCell.row][selectCell.col] = {
        ...updatedNote[selectCell.row][selectCell.col],
        [padString]: !currentNote[selectCell.row][selectCell.col][padString],
      };
      setCurrentNote(updatedNote);
      // const trueKeys = Object.keys(
      //   updatedNote[selectCell.row][selectCell.col]
      // ).filter(
      //   (key) => updatedNote[selectCell.row][selectCell.col][key] === true
      // );
      // console.log(
      //   `Row: ${selectCell.row} Col: ${selectCell.col} Noted:`,
      //   trueKeys
      // );
    } else {
      console.log("The number already inputed");
    }
  };

  const clearNote = () => {
    if (
      selectCell !== undefined &&
      isForInput[selectCell.row][selectCell.col]
    ) {
      const updatedNote: any = [...currentNote.map((row) => [...row])];
      const updateObject = Object.keys(
        updatedNote[selectCell.row][selectCell.col]
      ).reduce((obj, key) => ({ ...obj, [key]: false }), {});
      updatedNote[selectCell.row][selectCell.col] = updateObject;
      setCurrentNote(updatedNote);
      // console.log("cleared note");
    }
  };

  const clearFill = () => {
    if (
      selectCell !== undefined &&
      isForInput[selectCell.row][selectCell.col]
    ) {
      const updateValue = [...currentFill.map((row) => [...row])];
      updateValue[selectCell.row][selectCell.col] = 0;
      setCurrentFill(updateValue);
      setSelectCell({
        row: selectCell.row,
        col: selectCell.col,
        value: 0,
      });
      // console.log("clear fill");
    }
  };

  const handleSelection = useCallback(
    ({ x, y }: Coordinates, currentValue: number[][]) => {
      if (!measuredCellSize.current) {
        return;
      }
      const cellWidth = measuredCellSize.current.width / 9;
      const cellHeight = measuredCellSize.current.height;
      const targetCol = Math.min(Math.max(Math.floor(x / cellWidth), 0), 8);
      const targetRow = Math.min(Math.max(Math.floor(y / cellHeight), 0), 8);
      const cellNumber = currentValue[targetRow][targetCol];
      const result = { row: targetRow, col: targetCol, value: cellNumber };
      // console.log("here")
      return result;
    },
    []
  );

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    return event.target.measure(
      (_: number, __: number, width: number, height: number) =>
        (measuredCellSize.current = { width, height })
    );
  }, []);

  const getLineStyle = (index: number, isHorizontal: boolean) => {
    const linePattern = {
      isStartLine: index === 0,
      isTillEndLine: (index + 1) % 3 === 0,
    };
    const lineStyle = {
      [isHorizontal ? "borderBottomWidth" : "borderRightWidth"]:
        linePattern.isTillEndLine
          ? GRID_LAYOUT.borderBold
          : GRID_LAYOUT.borderThin,
      [isHorizontal ? "borderTopWidth" : "borderLeftWidth"]:
        linePattern.isStartLine ? GRID_LAYOUT.borderBold : undefined,
    };
    return lineStyle;
  };

  const getCellHilightStyle = (
    select: { row: number; col: number; value: number } | undefined,
    index: number,
    colIndex: number,
    cell: number
  ) => {
    if (select !== undefined) {
      const hilightPattern = {
        isCurrCell: select.row === index && select.col === colIndex,
        isCurrRow: select.row === index,
        isCurrCol: select.col === colIndex,
        isCurrBlock:
          Math.floor(select.row / 3) === Math.floor(index / 3) &&
          Math.floor(select.col / 3) === Math.floor(colIndex / 3),
        isGroup: select.value === cell && cell !== 0,
        isDupVH:
          (select.value === cell && cell !== 0 && select.row === index) ||
          (select.value === cell && cell !== 0 && select.col === colIndex),
        isDupBlock:
          Math.floor(select.row / 3) === Math.floor(index / 3) &&
          Math.floor(select.col / 3) === Math.floor(colIndex / 3) &&
          select.value === cell &&
          cell !== 0,
      };
      const hilightStyle = {
        backgroundColor: hilightPattern.isCurrCell
          ? "#044289"
          : hilightPattern.isDupVH || hilightPattern.isDupBlock
          ? "#522522"
          : hilightPattern.isCurrRow ||
            hilightPattern.isCurrCol ||
            hilightPattern.isCurrBlock
          ? "#141414"
          : hilightPattern.isGroup
          ? "#000000"
          : "#262626",
      };
      return hilightStyle;
    }
  };

  const getNumberTextStyle = (
    index: number,
    colIndex: number,
    cell: number
  ) => {
    const textPattern = {
      isFixNumber: isForInput[index][colIndex],
      isValid: cell === solution[index][colIndex],
      // ^this is option for setting :: check the puzzle with solution
    };
    const textStyle = {
      color: textPattern.isFixNumber
        ? textPattern.isValid
          ? "lightblue"
          : isEasyMode
          ? "red"
          : "lightblue"
        : "#979797",
    };
    return textStyle;
  };

  const panGesture = useMemo(() => {
    return Gesture.Pan()
      .enabled(!isWheelActive)
      .onBegin(({ x, y }: Coordinates) => {
        const value = handleSelection({ x, y }, currentFill);
        setSelectCell(value);
      })
      .onChange(({ x, y }: Coordinates) => {
        const value = handleSelection({ x, y }, currentFill);
        setSelectCell(value);
      })
      .runOnJS(true);
  }, [selectCell, handleSelection, currentFill, isWheelActive]);

  const pressed = useSharedValue<boolean>(false);
  const wheelLocationX = useSharedValue<number>(0);
  const wheelLocationY = useSharedValue<number>(0);

  const handleToggleWheel = () => {
    setIsWheelOpen(!isWheelActive);
  };

  const tapGesture = Gesture.Tap()
    .maxDuration(800)
    .maxDistance(cellSize)
    .enabled(!isWheelActive)
    .onBegin(({ x: locationX, y: locationY }: Coordinates) => {
      wheelLocationX.value = locationX;
      wheelLocationY.value = locationY;
      pressed.value = true;
    })
    .onFinalize((event) => {
      if (Platform.OS === "ios") {
        if (pressed.value == true && event.numberOfPointers === 1) {
          pressed.value = true;
          runOnJS(haptics)({ type: "impactHeavy" });
          runOnJS(handleToggleWheel)();
        } else {
          pressed.value = false;
        }
      } else {
        if (pressed.value == true && event.state === 1) {
          pressed.value = true;
          runOnJS(handleToggleWheel)();
        } else {
          pressed.value = false;
        }
      }
    })
    .onEnd(() => {
      pressed.value = false;
    });

  const [temp, setTemp] = useState()
  const newPan = Gesture.Pan().runOnJS(true)
    .onBegin((e) => {
      console.log("onBegin");
    })
    .onChange((e) => {
      const touchedNum = buttonPositionRef.current.find((item,index)=>{
        
      const dx = e.x - item.x;
      const dy = e.y - item.y;
      const result = Math.sqrt(dx * dx + dy * dy) < (cellSize /2);
      if (result){

      console.log(index)
      }
      })
    })
    .onFinalize((e) => console.log("onFinalize"));

  const taps = Gesture.Exclusive(panGesture, tapGesture, newPan);

  return (
    <View style={styles.container}>
      <NoteGrid currentNote={currentNote} cellSide={cellSize} />
      <GestureDetector gesture={taps}>
        <>
          <FrontPlane cellSide={cellSize} />
          {isWheelActive && (
            <DialWheel
              buttonPositionRef={buttonPositionRef}
              pressed={pressed}
              wheelLocationX={wheelLocationX}
              wheelLocationY={wheelLocationY}
              handleToggleWheel={handleToggleWheel}
              wheelSize={WHEEL_SIZE}
              cellSide={cellSize}
            />
          )}
        </>
      </GestureDetector>
      <FlatList
        style={styles.table}
        data={currentFill}
        keyExtractor={(_, i) => i.toString()}
        scrollEnabled={false}
        renderItem={({ item, index }) => {
          return (
            <View onLayout={onLayout} style={{ flexDirection: "row" }}>
              {item.map((cell, colIndex) => {
                return (
                  <View
                    key={index.toString() + colIndex.toString()}
                    style={[
                      styles.cell,
                      { height: cellSize, width: cellSize },
                      getLineStyle(index, true),
                      getLineStyle(colIndex, false),
                      getCellHilightStyle(selectCell, index, colIndex, cell),
                      //this need to be fix!!
                    ]}
                  >
                    <Text
                      style={[
                        styles.numberText,
                        getNumberTextStyle(index, colIndex, cell),
                      ]}
                    >
                      {cell === 0 ? "" : cell}
                    </Text>
                  </View>
                );
              })}
            </View>
          );
        }}
      />
    </View>
  ); //
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    alignItems: "center",
    justifyContent: "center",
  },
  table: {
    flexGrow: 0,
    zIndex: -1,
  },
  cell: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#262626",
    borderColor: "#4c4c4c",
  },
  numberText: {
    fontSize: 26,
  },
  testButton: {
    marginHorizontal: 10,
    paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: "white",
    borderRadius: 8,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: "rgba(0,0,0,0.2)",
  },
});
