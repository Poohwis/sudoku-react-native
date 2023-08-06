import { Pressable, Text, View } from "react-native";

export default function Numpad () {
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    return (
        <View style={{marginTop: 10, flexDirection: 'row'}}>
        {digits.map((digit) => (
            <Pressable key={digit} style={{paddingHorizontal: 7, margin:6}} onPress={()=>{ console.log("pressed:", digit)
            }}>
                <Text style={{fontSize: 26, fontWeight: 'bold', color: 'gray'}}>{digit}</Text>
            </Pressable>
        ))}
        </View>
    )
}