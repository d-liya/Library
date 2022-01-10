import Constants from "expo-constants";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import Colors from "../../constants/Colors";
import { useColorScheme } from "../../hooks";
import { Ionicons } from "@expo/vector-icons";

import { TouchableOpacity } from "../Themed";

const SPRING_CONFIG = {
  damping: 50,
  overshootClamping: true,
  restDisplacementThreshold: 0.1,
  restSpeedThreshold: 0.1,
  stiffness: 500,
};
type Props = {
  bottomSheetChildren: JSX.Element;
  children: JSX.Element;
  bottomSheetStyle?: {};
  style?: {};
};
export type RefProps =
  | React.MutableRefObject<{
      open: () => void;
      close: () => void;
    }>
  | React.MutableRefObject<undefined>;

const BottomSheetIOS = forwardRef(
  ({ bottomSheetChildren, children, bottomSheetStyle, style }: Props, ref) => {
    const windowHeight =
      Platform.OS === "android"
        ? Dimensions.get("screen").height
        : Dimensions.get("window").height;
    const windowWidth = Dimensions.get("window").width;
    const START_VALUE = windowHeight;
    const MAX_HEIGHT = Platform.OS === "ios" ? 50 : 80;
    const translateY = useSharedValue(START_VALUE);
    const _style = useAnimatedStyle(() => {
      return {
        transform: [
          { translateY: withSpring(translateY.value, SPRING_CONFIG) },
        ],
      };
    });
    const theme = useColorScheme();
    const onGestureEvent = useAnimatedGestureHandler({
      onStart: (event, ctx: { offsetY: number }) => {
        ctx.offsetY = translateY.value;
      },
      onActive: (event, ctx) => {
        if (ctx.offsetY + event.translationY > 5) {
          translateY.value = ctx.offsetY + event.translationY;
        }
      },
      onEnd: ({ velocityY, absoluteY }) => {
        if (velocityY > 0) {
          velocityY > 500
            ? (translateY.value = START_VALUE)
            : absoluteY > START_VALUE - 100
            ? (translateY.value = START_VALUE)
            : (translateY.value = MAX_HEIGHT);
          absoluteY > START_VALUE && translateY.value === START_VALUE
            ? (translateY.value = windowHeight)
            : null;
        } else {
          translateY.value = MAX_HEIGHT;
        }
      },
    });
    const wrapperStyle = useAnimatedStyle(() => {
      const valueTop = interpolate(
        translateY.value,
        [windowHeight, MAX_HEIGHT],
        [0, Constants.statusBarHeight]
      );
      const valueSide = interpolate(
        translateY.value,
        [windowHeight, MAX_HEIGHT],
        [0, 20]
      );
      const borderRadius = interpolate(
        translateY.value,
        [windowHeight, MAX_HEIGHT],
        [0, 10]
      );
      return {
        left: withSpring(valueSide, SPRING_CONFIG),
        top: withSpring(valueTop, SPRING_CONFIG),
        width: withSpring(windowWidth - 2 * valueSide, SPRING_CONFIG),
        borderRadius: withSpring(borderRadius, SPRING_CONFIG),
      };
    });

    useImperativeHandle(
      ref,
      () => ({
        open: _handleOpen,
        close: _handleClose,
      }),
      []
    );

    const _handleClose = () => {
      translateY.value = START_VALUE;
    };

    const _handleOpen = () => {
      translateY.value = MAX_HEIGHT;
    };

    return (
      <Animated.View style={[styles.wrapper]}>
        <Animated.View
          style={[
            styles.container,
            wrapperStyle,
            { backgroundColor: Colors[theme].background },
            style,
          ]}
        >
          {children}
        </Animated.View>
        <PanGestureHandler {...{ onGestureEvent }}>
          <Animated.View
            style={[
              styles.bottomSheetContainer,
              _style,
              { backgroundColor: Colors[theme].background },
              bottomSheetStyle,
            ]}
          >
            <TouchableOpacity
              onPress={_handleClose}
              style={[
                styles.iconWrapper,
                {
                  backgroundColor:
                    theme === "dark" ? Colors[theme].tint : "#A4A4A4",
                },
              ]}
            >
              <Ionicons
                name="close"
                size={15}
                color="white"
                style={styles.icon}
              />
            </TouchableOpacity>
            {bottomSheetChildren}
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
  wrapper: {
    flex: 1,
    backgroundColor: "rgba(44,44,46,0.8)",
  },
  bottomSheetContainer: {
    borderRadius: 10,
    ...StyleSheet.absoluteFillObject,
  },
  icon: {},
  iconWrapper: {
    backgroundColor: "#A4A4A4",
    alignSelf: "flex-end",
    borderRadius: 50,
    padding: 5,
    marginTop: 15,
    position: "absolute",
    zIndex: 10,
    right: 10,
  },
});

export default BottomSheetIOS;
