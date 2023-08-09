import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  View,
  LayoutChangeEvent,
  FlatList,
  StyleSheet,
  Dimensions,
  ListRenderItemInfo,
  Text,
} from "react-native";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { TEMP } from "../Quiz/temp";

interface CellSize {
  height: number;
  width: number;
}

interface Coordinates {
  x: number;
  y: number;
}

interface Store {
  row: number;
  col: number;
  value: number;
}

const TABLE_COLUMNS = 9;
const temp = TEMP[0].puzzle;

export function Table() {
  const cellSize = useRef<CellSize>();
  const [selectIndex, setSelectIndex] = useState<number>();
  const [store, setStore] = useState<Store>();

  const handleSelection = useCallback(({ x, y }: Coordinates) => {
    if (!cellSize.current) {
      return;
    }

    const cellWidth = cellSize.current.width;
    const cellHeight = cellSize.current.height / 9;

    const targetColumn = Math.floor(x / cellWidth);
    const targetRow = Math.floor(y / cellHeight);
    return targetRow * TABLE_COLUMNS + targetColumn;
  }, []);

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .onBegin(({ x, y }) => {
          const index = handleSelection({ x, y });
          setSelectIndex(index);
        })
        .onChange(({ x, y }: Coordinates) => {
          const index = handleSelection({ x, y });
          setSelectIndex(index);
        }),
    [selectIndex, handleSelection]
  );

  const onLayout = useCallback(
    (event: LayoutChangeEvent) =>
      event.target.measure(
        (_: number, __: number, width: number, height: number) =>
          (cellSize.current = { width, height })
      ),
    []
  );

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <FlatList
          style={styles.table}
          data={temp}
          keyExtractor={(_, i) => i.toString()}
          scrollEnabled={false}
          numColumns={TABLE_COLUMNS} ////need to change it to flexDirection : 'row'
          renderItem={({ item, index }) => {
            const colStyle = {
              isLeftEdge: index === 0,
              isRightEdge: index === 8,
              isVblock: (index + 1) % 3 === 0,
            };
            const verticalLineStyle = {
              borderTopWidth: 2,
              borderBottomWidth: 2,
              borderLeftWidth: colStyle.isLeftEdge ? 2 : undefined,
              borderRightWidth: colStyle.isRightEdge
                ? 2
                : colStyle.isVblock && !colStyle.isRightEdge
                ? 2
                : 0.5,
            };
            return (
              <View key={index} onLayout={onLayout} style={[verticalLineStyle]}>
                {item.map((cell, rowIndex) => {
                  const rowStyle = {
                    isBottomEdge: rowIndex === 8,
                    isHblock: (rowIndex + 1) % 3 === 0,
                  };
                  const horizontalLineStyle = {
                    borderBottomWidth: rowStyle.isHblock
                      ? 2
                      : !rowStyle.isBottomEdge && !rowStyle.isHblock
                      ? 0.5
                      : undefined,
                  };
                  const isSelect = {
                    cell: index + rowIndex * 9 === selectIndex,
                    row:
                      selectIndex !== undefined
                        ? Math.floor(selectIndex / 9) === rowIndex
                        : null,
                    col:
                      selectIndex !== undefined
                        ? selectIndex % 9 === index
                        : null,
                    block:
                      selectIndex !== undefined
                        ? Math.floor(selectIndex / 27) ===
                            Math.floor(rowIndex / 3) &&
                          Math.floor((selectIndex % 9) / 3) ===
                            Math.floor(index / 3)
                        : null,
                  };
                  const selectedStyle = {
                    backgroundColor: isSelect.cell
                      ? "#044289"
                      : isSelect.row || isSelect.col || isSelect.block  
                      ? "#AAAAAA"
                      : "#FFFFFF05",
                  };
                  return (
                    <View
                      key={rowIndex}
                      style={[styles.cell, selectedStyle, horizontalLineStyle]}
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
    </View>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get("screen");
const CELL_WIDTH = (SCREEN_WIDTH / TABLE_COLUMNS) * 0.96;
const CELL_HEIGHT = CELL_WIDTH;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  table: {
    flexGrow: 0,
  },
  cell: {
    height: CELL_HEIGHT,
    width: CELL_WIDTH,
    // borderWidth: 0.5,
    // borderColor: "black",
    // shadowOpacity: 1,
    // shadowColor: "black",
    // shadowOffset: { height: 1, width: 0 },
    justifyContent: "center",
    alignItems: "center",
  },
  number: {
    fontSize: 26,
    color: "teal",
  },
});
