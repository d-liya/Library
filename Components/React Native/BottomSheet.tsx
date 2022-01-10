/**
 * Bottom Sheet
 */

import React, { forwardRef, useImperativeHandle } from "react";
import { Platform, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

const SPRING_CONFIG = {
  damping: 50,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 500,
};
type PositionProps = "HIDDEN" | "HALF";

type Props = {
  children: JSX.Element;
  startPosition?: PositionProps;
  sharedValue?: Animated.SharedValue<number>;
};

const _handlePosition = (position: PositionProps, height: number) => {
  switch (position) {
    case "HIDDEN":
      return height;
    case "HALF":
      return height / 2;
  }
};
const BottomSheet = forwardRef(
  ({ children, startPosition = "HALF", sharedValue }: Props, ref) => {
    const windowHeight =
      Platform.OS == "ios"
        ? Dimensions.get("window").height
        : Dimensions.get("screen").height;
    let START_VALUE = _handlePosition(startPosition, windowHeight);
    const translateY = sharedValue ? sharedValue : useSharedValue(START_VALUE);
    const _handleOpen = () => {
      translateY.value = 100;
    };
    const _handleClose = () => {
      translateY.value = START_VALUE;
    };
    const theme = useColorScheme();

    useImperativeHandle(
      ref,
      () => ({
        open: _handleOpen,
        close: _handleClose,
      }),
      []
    );

    const onGestureEvent = useAnimatedGestureHandler({
      onStart: (event, ctx: { offsetY: number }) => {
        ctx.offsetY = translateY.value;
      },
      onActive: (event, ctx) => {
        if (ctx.offsetY + event.translationY > 0) {
          translateY.value = ctx.offsetY + event.translationY;
        }
      },
      onEnd: ({ velocityY, absoluteY, velocityX }, ctx) => {
        if (velocityY > 0) {
          velocityY > 500
            ? (translateY.value = START_VALUE)
            : absoluteY > START_VALUE - 100
            ? (translateY.value = START_VALUE)
            : (translateY.value = 100);
          absoluteY > START_VALUE && translateY.value === START_VALUE
            ? (translateY.value = windowHeight - 155)
            : null;
        } else {
          absoluteY < START_VALUE
            ? velocityY < -500
              ? (translateY.value = 100)
              : absoluteY < 250
              ? (translateY.value = 100)
              : (translateY.value = START_VALUE)
            : (translateY.value = START_VALUE);
        }
      },
    });

    const style = useAnimatedStyle(() => {
      return {
        transform: [
          { translateY: withSpring(translateY.value, SPRING_CONFIG) },
        ],
      };
    });
    return (
      <>
        <PanGestureHandler {...{ onGestureEvent }}>
          <Animated.View
            style={[
              style,
              styles.container,
              { backgroundColor: Colors[theme].background },
            ]}
          >
            {children}
          </Animated.View>
        </PanGestureHandler>
      </>
    );
  }
);
export default BottomSheet;
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    padding: 20,
    height: "100%",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    backgroundColor: "black",
    opacity: 0.5,
  },
  headerText: {
    paddingBottom: 20,
  },
  icon: {
    position: "absolute",
    right: 30,
    top: 20,
  },
  khob: {
    width: 30,
    height: 5,
    borderRadius: 100,
    backgroundColor: Colors["light"].border,
    alignSelf: "center",
    position: "absolute",
    top: 8,
  },
});
