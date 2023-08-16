import { useCallback, memo } from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { SelectCell } from "./grid";
import { MaterialCommunityIcons } from "@expo/vector-icons";
interface NumpadComponentProps {
  handleNoteModeToggle: () => void;
  isNoteMode: boolean;
  setPad: (num: number)=> void
}
// style on this page is still messed up
function NumPadComponent({
  handleNoteModeToggle,
  isNoteMode,
  setPad,
}: NumpadComponentProps) {
  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  console.log('re-rendered: NumPad')

  return (
    <>
      <View
        style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}
      >
        {digits.map((digit) => (
          <Pressable
            key={digit}
            style={{ paddingHorizontal: 7, margin: 4 }}
            onPress={() => {
              console.log("pressed:",digit)
              setPad(digit)
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
          // backgroundColor: 'red',
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            console.log("pressed: 0")
            setPad(0)
          }}
        >
          <MaterialCommunityIcons name="eraser" size={24} color="gray" />
        </TouchableOpacity>
        <View>
          <TouchableOpacity onPress={() => handleNoteModeToggle()}>
            <MaterialCommunityIcons name="pencil" size={24} color="gray" />
            {/* may add interpolate of on/off sliding in and out */}
            <View
              style={{
                flex: 1,
                backgroundColor: isNoteMode ? "#044289" : "#262626",
                width: 18,
                height: 12,
                position: "absolute",
                borderRadius: 8,
                right: -4,
                bottom: -4,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 7, textAlign: "center", color: "#979797" }}
              >
                {isNoteMode ? "ON" : "OFF"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

export const NumPad = memo(NumPadComponent)
