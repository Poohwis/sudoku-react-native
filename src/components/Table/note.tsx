import { View, FlatList, StyleSheet, Text } from "react-native";
import { CELL_HEIGHT, CELL_WIDTH } from "./grid";

interface NoteProps {
  currentNote: number[][];
}
const CELL_MARGIN = 0.87
const height = CELL_HEIGHT * CELL_MARGIN
const width = CELL_WIDTH * CELL_MARGIN
export default function Note({ currentNote }: NoteProps) {
  const noteGrid = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];
  return (
    // <FlatList style={styles.noteGrid}
    // data = {currentNote}
    // scrollEnabled ={false}
    // keyExtractor={(_, i)=> i.toString()}
    // renderItem={({item ,index}) => {
    //     return(
    //         <View style={{backgroundColor: 'red'}}></View>
    //     )
    // }} />
    <View
      style={{
        height: height,
        width: width,
      }}
    >
      {noteGrid.map((item, index) => (
        <View
          style={{
            height: height / 3,
            width: width,
            flexDirection: "row",
            // justifyContent: "center",
            // alignItems: "center",
          }}
        >
          {item.map((number) => (
            <View
              style={{
                width: width / 3,
                height: height / 3,
                // justifyContent: "center",
                alignItems: "center",
                borderWidth: 1
              }}
            >
              <Text style={{ fontSize: 10, color: "#979797" }}>{number}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  noteGrid: {
    backgroundColor: "red",
  },
});
