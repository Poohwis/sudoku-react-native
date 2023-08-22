import { memo, useCallback, useRef, useState } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
interface NoteGridComponentProps {
  currentNote: Record<string, boolean>[][];
  cellSide: number;
}
interface InGridNumber {
  data: Record<string, boolean>;
  cellSide: number;
}
const InGridNumber = memo(({ data, cellSide }: InGridNumber) => {
  // console.log("Ingrid called");
  const numbers = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];
  return (
    <View>
      {numbers.map((numberRow, rowIndex) => {
        return (
          <View
            key={rowIndex}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              height: cellSide / 3,
              width: cellSide,
            }}
          >
            {numberRow.map((cell, colIndex) => {
              return (
                <View
                  key={colIndex}
                  style={{ width: cellSide / 3, alignItems: "center" }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: "#979797",
                      display: data[cell] === true ? "flex" : "none",
                    }}
                  >
                    {cell}
                  </Text>
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
});

function NoteGridComponent({ currentNote, cellSide }: NoteGridComponentProps) {
  console.log("re-rendered: NoteGrid");
  return (
      <FlatList
        style={styles.noteTable}
        data={currentNote}
        keyExtractor={(_, i) => i.toString()}
        scrollEnabled={false}
        renderItem={({ item, index }) => {
          // console.log(index)
          return (
            <View key={index} style={styles.row}>
              {item.map((cell, colIndex) => {
                return (
                  <View
                    pointerEvents="none"
                    key={colIndex}
                    style={[
                      styles.noteCell,
                      { width: cellSide, height: cellSide },
                    ]}
                  >
                    <InGridNumber data={cell} cellSide={cellSide} />
                  </View>
                );
              })}
            </View>
          );
        }}
      />
  );
}

const styles = StyleSheet.create({
  container: {
  },
  row: {
    flexDirection: "row",
  },
  noteTable: {
    flexGrow: 0,
    position: "absolute",
    // backgroundColor: "red",
    // zIndex: 1,
  },
  noteCell: {
    // borderWidth: 3,
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
});

export const NoteGrid = memo(NoteGridComponent);
