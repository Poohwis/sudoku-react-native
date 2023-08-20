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
  Dimensions,
  Text,
} from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { NumPad } from "./numpad";
import { NoteGrid } from "./notegrid";

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
}

const TABLE_COLUMNS = 9;
const { width: SCREEN_WIDTH } = Dimensions.get("screen");
const CELL_RATIO = 0.99;
export const CELL_SIDE = Math.floor(
  (SCREEN_WIDTH / TABLE_COLUMNS) * CELL_RATIO
);

export function Grid({ data }: GridProps) {
  const { puzzle, solution } = data;
  const cellSize = useRef<CellSize>();
  const initialGrid = [...puzzle.map((row) => [...row])];
  const isForInput = initialGrid.map((row) => row.map((cell) => cell === 0));
  const [currentFill, setCurrentFill] = useState<number[][]>(initialGrid);
  const [selectCell, setSelectCell] = useState<SelectCell>();
  const noteObj = Object.fromEntries(
    Array.from({ length: 9 }, (_, index) => [index + 1, false])
  );
  const noteArray = new Array(9).fill(0).map(() => new Array(9).fill(noteObj));
  const [currentNote, setCurrentNote] =
    useState<Record<string, boolean>[][]>(noteArray);
  const [isNoteMode, setIsNoteMode] = useState<boolean>(false);
  const [pressedNum, setPressedNum] = useState<number | undefined>(undefined);

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

  const handleNoteModeToggle = useCallback(() => {
    setIsNoteMode(!isNoteMode);
  }, [isNoteMode]);

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

      return result;
    },
    []
  );

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(({ x, y }: Coordinates) => {
          const value = handleSelection({ x, y }, currentFill);
          setSelectCell(value);
        })
        .onChange(({ x, y }: Coordinates) => {
          const value = handleSelection({ x, y }, currentFill);
          setSelectCell(value);
        }),
    [selectCell, handleSelection, currentFill]
  );

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
  }

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
        ? // ? textPattern.isValid
          "lightblue"
        : // : "red"
          "#979797",
    };
    return textStyle;
  };

  return (
    <>
      <View style={styles.container}>
        <GestureDetector gesture={gesture}>
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
                          getLineStyle(index, true),
                          getLineStyle(colIndex, false),
                          getCellHilightStyle(
                            selectCell,
                            index,
                            colIndex,
                            cell
                          ),
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
        </GestureDetector>
      <NoteGrid currentNote={currentNote} cellSide={CELL_SIDE} />
      </View>
      <NumPad
        setPad={setPressedNum}
        isNoteMode={isNoteMode}
        handleNoteModeToggle={handleNoteModeToggle}
      />
    </>
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
    // position: 'absolute'
  },
  cell: {
    height: CELL_SIDE,
    width: CELL_SIDE,
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
