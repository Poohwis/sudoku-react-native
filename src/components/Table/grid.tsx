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
  TouchableOpacity,
} from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Numpad from "./numpad";

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

export function Grid({ data }: GridProps) {
  const { puzzle, solution } = data;
  const initialGrid = [...puzzle.map((row) => [...row])];
  const isForInput = initialGrid.map((row) => row.map((cell) => cell === 0));
  const [currentValue, setCurrentValue] = useState<number[][]>(initialGrid);
  const [selectCell, setSelectCell] = useState<SelectCell>();
  const cellSize = useRef<CellSize>();

  const handleInputNumber = (
    target: { row: number; col: number },
    num: number
  ) => {
    if (target !== undefined && isForInput[target.row][target.col]) {
      const updatedValue = [...currentValue.map((row) => [...row])];
      updatedValue[target.row][target.col] = num;
      setCurrentValue(updatedValue);
      setSelectCell({ row: target.row, col: target.col, value: num });
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
      // console.log(currentValue[8])
      return result;
    },
    []
  );

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(({ x, y }: Coordinates) => {
          const value = handleSelection({ x, y }, currentValue);
          setSelectCell(value);
        })
        .onChange(({ x, y }: Coordinates) => {
          const value = handleSelection({ x, y }, currentValue);
          setSelectCell(value);
        }),
    [selectCell, handleSelection, currentValue]
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
        isDuplicate:
          (select.value === cell && cell !== 0 && select.row === index) ||
          (select.value === cell && cell !== 0 && select.col === colIndex),
      };
      // console.log(selectCell)
      const hilightStyle = {
        backgroundColor: hilightPattern.isCurrCell
          ? "#044289"
          : hilightPattern.isDuplicate
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
        // ? textPattern.isValid
          ? "teal"
          // : "red"
        : "#979797",
    };
    return textStyle;
  };

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <FlatList
          style={styles.table}
          data={currentValue}
          keyExtractor={(_, i) => i.toString()}
          scrollEnabled={false}
          renderItem={({ item, index }) => {
            return (
              <View
                // key={index}
                onLayout={onLayout}
                style={{ flexDirection: "row" }}
              >
                {item.map((cell, colIndex) => {
                  return (
                    <View
                      key={index.toString() + colIndex.toString()}
                      style={[
                        styles.cell,
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
      </GestureDetector>
      <Numpad handleInputNumber={handleInputNumber} selectCell={selectCell} />
      <TouchableOpacity
        style={styles.testButton}
        onPress={() => {
          const deepCopy = puzzle.map((row) => [...row]);
          setCurrentValue(deepCopy);
        }}
      >
        <Text>Reset</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.testButton}
        onPress={() => {
          const deepCopy = solution.map((row) => [...row]);
          setCurrentValue(deepCopy);
        }}
      >
        <Text>Solution</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.testButton}
        onPress={() => {
          console.log("curr:", currentValue[8]);
        }}
      >
        <Text>Print</Text>
      </TouchableOpacity>
    </View>
  ); //
}

const TABLE_COLUMNS = 9;
const { width: SCREEN_WIDTH } = Dimensions.get("screen");
const CELL_WIDTH = Math.floor((SCREEN_WIDTH / TABLE_COLUMNS) * 0.99);
const CELL_HEIGHT = CELL_WIDTH;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    alignItems: "center",
    justifyContent: "center",
  },
  table: {
    flexGrow: 0,
  },
  cell: {
    height: CELL_HEIGHT,
    width: CELL_WIDTH,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#262626",
    borderColor: "#4c4c4c",
  },
  numberText: {
    fontSize: 26,
    // color: "#979797",
  },
  testButton: {
    marginBottom: 5,
    paddingVertical: 5,
    backgroundColor: "white",
  },
});
