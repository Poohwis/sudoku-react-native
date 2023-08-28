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
} from "react-native";
import * as Haptics from "expo-haptics";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { NoteGrid } from "./notegrid";
import { FrontPlane } from "./frontplane";
import Animated, { useSharedValue } from "react-native-reanimated";

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
  cellSide: number;
  currentNote: Record<string, boolean>[][];
  setCurrentNote: (data: Record<string, boolean>[][]) => void;
  isEasyMode: boolean;
}

export function Grid({
  data,
  isNoteMode,
  pressedNum,
  setPressedNum,
  cellSide,
  currentNote,
  setCurrentNote,
  isEasyMode,
}: GridProps) {
  const { puzzle, solution } = data;
  const cellSize = useRef<CellSize>();
  const initialGrid = [...puzzle.map((row) => [...row])];
  const isForInput = initialGrid.map((row) => row.map((cell) => cell === 0));
  const [currentFill, setCurrentFill] = useState<number[][]>(initialGrid);
  const [selectCell, setSelectCell] = useState<SelectCell>();
  const [isPressing, setIsPressing] = useState<boolean>(false);
  const [isModalShow, setIsModalShow] = useState<boolean>(false);
  const [longPressLocation, setLongPressLocation] = useState<Coordinates>({
    x: 0,
    y: 0,
  });
  const holdingRef = useRef<number>();

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
      if (!cellSize.current) {
        return;
      }
      const cellWidth = cellSize.current.width / 9;
      const cellHeight = cellSize.current.height;
      const targetCol = Math.min(Math.max(Math.floor(x / cellWidth), 0), 8);
      const targetRow = Math.min(Math.max(Math.floor(y / cellHeight), 0), 8);
      const cellNumber = currentValue[targetRow][targetCol];
      const result = { row: targetRow, col: targetCol, value: cellNumber };
      // console.log("here")
      return result;
    },
    []
  );

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(({ x, y }: Coordinates) => {
          const value = handleSelection({ x, y }, currentFill);
          setSelectCell(value);
        })
        .onChange(({ x, y }: Coordinates) => {
          const value = handleSelection({ x, y }, currentFill);
          setSelectCell(value);
        })
        .runOnJS(true),
    [selectCell, handleSelection, currentFill]
  );

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((_event, success) => {
      if (success) {
        console.log("double tap");
      }
    });

  const [indicator, setIndicator] = useState<"hold" | "release" | "move">(
    "release"
  ); //temporary
  const handlePressIn = ({ x, y }: Coordinates) => {
    setIsPressing(true);
    setLongPressLocation({ x, y });
    setIndicator("hold"); //temporary
  };
  const handlePressOut = () => {
    setIsModalShow(false);
    setIsPressing(false);
    clearTimeout(holdingRef.current);
  };

  const longPressGesture = Gesture.LongPress()
    .onBegin(({ x, y }: Coordinates) => {
      handlePressIn({ x, y });
    })
    .onTouchesMove(({ allTouches }) => {
      if (
        (!isModalShow &&
          Math.abs(longPressLocation.x - allTouches[0].x) > 10) ||
        Math.abs(longPressLocation.y - allTouches[0].y) > 10
      ) {
        setIndicator("move");
        console.log(indicator);
        handlePressOut();
      }
    })
    .onFinalize(() => {
      setIndicator("release");
      handlePressOut();
    })
    .runOnJS(true);

  const taps = Gesture.Race(
    Gesture.Exclusive(panGesture, longPressGesture),
    doubleTapGesture
  );

  useEffect(() => {
    console.log(isPressing, "\n---------------");
    holdingRef.current = window.setTimeout(() => {
      if (isPressing) {
        console.log("pop");
        setIsModalShow(true);
      }
    }, 800);
  }, [isPressing]);

  const onLayout = useCallback(
    (event: LayoutChangeEvent) =>
      event.target.measure(
        (_: number, __: number, width: number, height: number) =>
          (cellSize.current = { width, height })
      ),
    []
  );

  const getLineStyle = (index: number, isHorizontal: boolean) => {
    const linePattern = {
      isStartLine: index === 0,
      isTillEndLine: (index + 1) % 3 === 0,
    };
    const lineStyle = {
      [isHorizontal ? "borderBottomWidth" : "borderRightWidth"]:
        linePattern.isTillEndLine ? 3 : 0.8,
      [isHorizontal ? "borderTopWidth" : "borderLeftWidth"]:
        linePattern.isStartLine ? 3 : undefined,
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

  return (
    <View style={styles.container}>
      <NoteGrid currentNote={currentNote} cellSide={cellSide} />
      <GestureDetector gesture={taps}>
        <FrontPlane cellSide={cellSide} />
      </GestureDetector>
      {isModalShow ? (
        <View
          onLayout={() =>
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
          }
          style={{
            backgroundColor: "#97979799",
            width: cellSide * 3,
            height: cellSide * 3,
            position: "absolute",
            justifyContent: "center",
            borderRadius: cellSide * 3,
            alignItems: "center",
          }}
        >
          <Text>.</Text>
        </View>
      ) : null}
      <TouchableOpacity
        style={{
          backgroundColor:
            indicator === "hold"
              ? "green"
              : indicator === "release"
              ? "red"
              : "blue",
          position: "absolute",
          width: cellSide,
          height: cellSide,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: cellSide,
        }}
      >
        <Text style={{ fontSize: 8, color: "white" }}>
          {indicator.toString()}
        </Text>
      </TouchableOpacity>
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
                      { height: cellSide, width: cellSide },
                      getLineStyle(index, true),
                      getLineStyle(colIndex, false),
                      getCellHilightStyle(selectCell, index, colIndex, cell),
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
});
