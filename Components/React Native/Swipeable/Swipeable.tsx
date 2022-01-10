/**
 * Performant Swipeable component using gestures.
 * Should wrap the swipeable inside the swipeable context if want to close one swipeable while open another.
 */

import React, { useContext, useEffect } from "react";
import { StyleSheet } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SwipeContext } from "./SwipeableContext";
import { View } from "./Themed";

type Props = {
  children: JSX.Element;
  leftView?: () => JSX.Element;
  rightView?: () => JSX.Element;
  leftSnapPoint?: number;
  rightSnapPoint?: number;
  shareValue?: Animated.SharedValue<number>;
  index: number;
};

export default function SwipeableRow({
  children,
  leftView,
  rightView,
  leftSnapPoint = 0,
  rightSnapPoint = 0,
  shareValue = useSharedValue(0),
  index,
}: Props) {
  const translateX = shareValue;
  const { openedItemKey, setOpenedItemKey, isFocusedScreen } =
    useContext(SwipeContext);
  const set = () => {
    setOpenedItemKey(index);
  };
  const close = () => {
    translateX.value = 0;
  };
  useEffect(() => {
    if (openedItemKey && index !== openedItemKey) {
      close();
    }
  }, [index, openedItemKey]);

  useEffect(() => {
    close();
  }, [isFocusedScreen]);
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (event, ctx: { offsetX: number }) => {
      ctx.offsetX = translateX.value;
    },
    onActive: (event, ctx) => {
      const x = ctx.offsetX + event.translationX;
      if (x < 30 + leftSnapPoint && x > -(30 + rightSnapPoint)) {
        translateX.value = x;
      }
    },
    onEnd: ({ velocityX }, ctx) => {
      if (velocityX > 0) {
        //Right
        if (leftSnapPoint && ctx.offsetX >= 0) {
          translateX.value = leftSnapPoint;
          runOnJS(set)();
        } else {
          translateX.value = 0;
        }
      } else if (velocityX < 0) {
        if (rightSnapPoint && ctx.offsetX <= 0) {
          translateX.value = -rightSnapPoint;
          runOnJS(set)();
        } else {
          translateX.value = 0;
        }
      } else {
        translateX.value = 0;
      }
    },
  });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(translateX.value) }],
  }));
  return (
    <View style={{ flexDirection: "row" }}>
      {leftView && leftView()}
      <PanGestureHandler
        activeOffsetY={[0, 20]}
        onGestureEvent={onGestureEvent}
      >
        <Animated.View style={[style, { flex: 1 }]}>{children}</Animated.View>
      </PanGestureHandler>
      {rightView && rightView()}
    </View>
  );
}
