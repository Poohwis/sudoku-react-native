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
  Pressable,
} from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { TEMP } from "../Quiz/temp";
import Numpad from "./Numpad";

interface CellSize {
  height: number;
  width: number;
}

interface Coordinates {
  x: number;
  y: number;
}

interface SelectCell {
  row: number;
  col: number;
  value: number;
}

const TABLE_COLUMNS = 9;
const temp = TEMP[0].quiz;

export function TempTable() {
  const cellSize = useRef<CellSize>();
  const [selectCell, setSelectCell] = useState<SelectCell>();

//this might be async which fetch data from database
//or the game has stored all the quiz in the app? << this one
  useEffect(()=>{

  },[])
  const handleSelection = useCallback(({ x, y }: Coordinates) => {
    if (!cellSize.current) {
      return;
    }

    const cellWidth = cellSize.current.width / 9;
    const cellHeight = cellSize.current.height;

    const targetCol = Math.min(Math.max(Math.floor(x / cellWidth), 0), 8);
    const targetRow = Math.min(Math.max(Math.floor(y / cellHeight), 0), 8);
    const cellNumber = temp[targetRow][targetCol];
    const result = { row: targetRow, col: targetCol, value: cellNumber };

    return result;
  }, []);

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(({ x, y }) => {
          const value = handleSelection({ x, y });
          setSelectCell(value);
        })
        .onChange(({ x, y }: Coordinates) => {
          const value = handleSelection({ x, y });
          setSelectCell(value);
        }),
    [selectCell, handleSelection]
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
      startLine: index === 0,
      tillEndLine: (index + 1) % 3 === 0,
    };
    const lineStyle = {
      [isHorizontal ? "borderBottomWidth" : "borderRightWidth"]:
        linePattern.tillEndLine ? 3 : 0.8,
      [isHorizontal ? "borderTopWidth" : "borderLeftWidth"]:
        linePattern.startLine ? 3 : undefined,
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
        currCell: select.row === index && select.col === colIndex,
        currRow: select.row === index,
        currCol: select.col === colIndex,
        currBlock:
          Math.floor(select.row / 3) === Math.floor(index / 3) &&
          Math.floor(select.col / 3) === Math.floor(colIndex / 3),
        group: select.value === cell && cell !== 0,
      };
      const hilightStyle = {
        backgroundColor: hilightPattern.currCell
          ? "#044289"
          : hilightPattern.currRow ||
            hilightPattern.currCol ||
            hilightPattern.currBlock
          ? "#141414"
          : hilightPattern.group
          ? "#000000"
          : "#262626",
      };
      return hilightStyle;
    }
  };

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <FlatList
          style={styles.table}
          data={temp}
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
                      <Text style={styles.number}>
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
      <Numpad />
    </View>
  ); //
}

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
    borderColor: '#4c4c4c'
  },
  number: {
    fontSize: 26,
    color: "teal",
  },
});
