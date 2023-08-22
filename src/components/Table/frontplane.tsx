import {memo} from 'react'
import { View, FlatList, StyleSheet, Text } from "react-native";
interface FrontPlaneComponentProps {
  cellSide: number;
}
function FrontPlaneComponent({ cellSide }: FrontPlaneComponentProps) {
  return (
    <FlatList
      style={styles.table}
      keyExtractor={(_, i) => i.toString()}
      data={new Array(81).fill(0)}
      scrollEnabled={false}
      numColumns={9}
      renderItem={({ index }) => {
        return (
          <View key={index} style={{ width: cellSide, height: cellSide }}>
          </View>
        );
      }}
    />
  );
}
const styles = StyleSheet.create({
  table: {
    flexGrow: 0,
    position: "absolute",
  },
});

export const FrontPlane = memo(FrontPlaneComponent)