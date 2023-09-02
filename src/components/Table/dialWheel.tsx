import { useEffect, useRef, useState } from "react";
import { BlurView } from "expo-blur";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface DialWheelProps {
  pressed: { value: boolean };
  wheelLocationX: { value: number };
  wheelLocationY: { value: number };
  handleToggleWheel: () => void;
  wheelSize: number;
  cellSide: number;
  buttonPositionRef: {current: Record<string, number>[]}
}
export default function DialWheel({
  pressed,
  wheelLocationX,
  wheelLocationY,
  handleToggleWheel,
  wheelSize,
  cellSide,
  buttonPositionRef
}: DialWheelProps) {
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
  const numberOfItems = 9;
  const items = Array.from({ length: numberOfItems }, (_, index) => index + 1);
  const angleIncrement = (2 * Math.PI) / numberOfItems;
  const dialArea = cellSide * 9;

  const positionX =
    Math.floor(wheelLocationX.value / cellSide) * cellSide -
    (wheelSize / 2 - cellSide / 2);
  const positionY =
    Math.floor(wheelLocationY.value / cellSide) * cellSide -
    (wheelSize / 2 - cellSide / 2);
  const containerStyles = useAnimatedStyle(() => ({
    left: positionX,
    top: positionY,
    // backgroundColor: "#ff00ff99",
  }));

  const buttonTranslations = items.map(() => ({
    translateX: useSharedValue(0),
    translateY: useSharedValue(0),
  }));

  const buttonAnimationStyles = buttonTranslations.map((translation, index) =>
    useAnimatedStyle(() => ({
      transform: [
        {
          translateX: withTiming(translation.translateX.value, {
            duration: 200,
            easing: Easing.elastic(1),
          }),
        },
        {
          translateY: withTiming(translation.translateY.value, {
            duration: 200,
            easing: Easing.elastic(1),
          }),
        },
      ],
    }))
  );

  const onLayout = (index: number) => {
    const angle = index * angleIncrement - 90;
    const distance = wheelSize / 2;
    const x = distance * Math.cos(angle);
    const y = distance * Math.sin(angle);
    buttonTranslations[index].translateX.value = x;
    buttonTranslations[index].translateY.value = y;
    const posX =
      Math.floor(wheelLocationX.value / cellSide) * cellSide + x + cellSide / 2;
    const posY =
      Math.floor(wheelLocationY.value / cellSide) * cellSide + y + cellSide / 2;
    console.log("number:", index + 1, posX, posY);
    buttonPositionRef.current[index] = {x:posX, y: posY}

  };

  return (
    <>
      <Pressable style={styles.backdrop} onPress={handleToggleWheel} />
      <View style={{ width: dialArea, height: dialArea, position: "absolute" }}>
        <Pressable style={styles.backdrop} onPress={handleToggleWheel} />
        <Animated.View
          onLayout={() => {
            console.log("dialShow");
          }}
          style={[
            {
              height: wheelSize,
              width: wheelSize,
              position: "absolute",
            },
            containerStyles,
          ]}
        >
          {items.map((item, index) => {
            const center = wheelSize / 2 - cellSide / 2;
            return (
              <AnimatedPressable
                key={index}
                onPress={() => console.log(buttonPositionRef.current[index])}
                onLayout={() => {
                  onLayout(index);
                }}
                style={[
                  styles.dialCircle,
                  {
                    left: center,
                    top: center,
                    width: cellSide,
                    height: cellSide,
                    borderRadius: cellSide / 2,
                  },
                  buttonAnimationStyles[index],
                ]}
              >
                <Text style={styles.dialText}>{item}</Text>
              </AnimatedPressable>
            );
          })}
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'blue'
  },

  dialCircle: {
    position: "absolute",
    backgroundColor: "#979797",
    justifyContent: "center",
    alignItems: "center",
  },

  dialText: {
    fontSize: 24,
    color: "#ffffff",
  },
});
