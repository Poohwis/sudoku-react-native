import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { SelectCell } from "./grid";
import { MaterialCommunityIcons } from "@expo/vector-icons";
interface NumpadProps {
  handleInputNumber: (
    target: { row: number; col: number },
    num: number
  ) => void;
  selectCell: SelectCell | undefined;
  handleNoteModeToggle: () => void;
  isNoteMode: boolean;
}
// style on this page is still messed up
export default function Numpad({
  handleInputNumber,
  selectCell,
  handleNoteModeToggle,
  isNoteMode,
}: NumpadProps) {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <View>
      <View
        style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}
      >
        {digits.map((digit) => (
          <Pressable
            key={digit}
            style={{ paddingHorizontal: 7, margin: 4 }}
            onPress={() => {
              selectCell && handleInputNumber(selectCell, digit);
            }}
          >
            <Text style={{ fontSize: 26, fontWeight: "bold", color: "gray" }}>
              {digit}
            </Text>
          </Pressable>
        ))}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginBottom: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            selectCell && handleInputNumber(selectCell, 0);
          }}
        >
          <MaterialCommunityIcons name="eraser" size={24} color="gray" />
        </TouchableOpacity>
        <View>
          <TouchableOpacity onPress={() => handleNoteModeToggle()}>
            <MaterialCommunityIcons name="pencil" size={24} color="gray" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 6,
              color: "#ffffff",
              textAlign: "center",
              position: "absolute",
              backgroundColor: isNoteMode ? "teal" : "#262626",
              right: -3,
              bottom: -4,
              borderRadius: 8,
              paddingHorizontal: 4,
              paddingVertical: 3,
              borderColor: "#141414",
              borderWidth: 1,
              textAlignVertical: "center",
            }}
          >
            {isNoteMode ? "ON" : "OFF"}
          </Text>
        </View>
      </View>
    </View>
  );
}
