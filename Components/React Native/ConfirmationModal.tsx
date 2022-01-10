/**
 * ConfirmationModal
 */

import React from "react";
import { StyleSheet } from "react-native";
import { Text, TouchableOpacity, TouchableOpacityProps, View } from "./Themed";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";
import { tintIndigo } from "../constants/Colors";
import ActivityIndicator from "./ActivityIndicator";
export type Props = {
  message?: string;
  isOpen: boolean;
  leftBtnText?: string;
  rightBtnText?: string;
  onLeftBtnPress?: TouchableOpacityProps["onPress"];
  onRightBtnPress?: TouchableOpacityProps["onPress"];
  leftBtnColor?: string;
  rightBtnColor?: string;
  btnText?: string;
  btnColor?: string;
  onBtnPress?: TouchableOpacityProps["onPress"];
  leftBtnBold?: boolean;
  loading?: boolean;
  messageColor?: string;
};
/**
 * If you only want one button use only btnText, btnColor, onBtnPress
 * @param param0
 * @returns
 */
export default function ConfirmationModal({
  message,
  isOpen,
  leftBtnText,
  rightBtnText,
  onLeftBtnPress,
  onRightBtnPress,
  leftBtnColor,
  rightBtnColor,
  btnColor,
  btnText,
  onBtnPress,
  leftBtnBold,
  loading,
  messageColor,
}: Props) {
  return (
    <View
      style={[
        style.background,
        isOpen ? { display: "flex" } : { display: "none" },
      ]}
    >
      <View whiten style={style.modal}>
        {loading && <ActivityIndicator />}
        <Text
          text="semiBoldbodyText"
          style={style.message}
          color={messageColor}
        >
          {loading ? "Loading" : message}
        </Text>
      </View>
      <View whiten style={style.buttons}>
        {leftBtnText && rightBtnText && !loading ? (
          <>
            <Button
              style={{
                borderBottomStartRadius: 20,
                borderRightWidth: 0.3,
              }}
              color={leftBtnColor}
              onPress={onLeftBtnPress}
              bold={leftBtnBold}
            >
              {leftBtnText}
            </Button>
            <Button
              style={{ borderBottomEndRadius: 20 }}
              color={rightBtnColor}
              onPress={onRightBtnPress}
            >
              {rightBtnText}
            </Button>
          </>
        ) : null}
        {btnText && !(leftBtnText && rightBtnText && loading) ? (
          <Button
            style={{
              borderBottomRightRadius: 20,
              borderBottomLeftRadius: 20,
            }}
            color={btnColor}
            onPress={onBtnPress}
          >
            {btnText}
          </Button>
        ) : null}
        {loading && (
          <View
            whiten
            style={{
              borderBottomRightRadius: 20,
              borderBottomLeftRadius: 20,
              height: 30,
              width: "100%",
            }}
          />
        )}
      </View>
    </View>
  );
}

const Button = ({
  children,
  color,
  bold,
  ...props
}: TouchableOpacityProps & { color?: string; bold?: boolean }) => {
  return (
    <TouchableOpacity whiten {...props} style={[style.button, props.style]}>
      <Text
        text="secondaryText"
        color={color}
        style={[style.buttonText, bold ? { fontWeight: "bold" } : {}]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  modal: {
    padding: 20,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    width: "80%",
    minHeight: 100,
  },
  message: {
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    width: "80%",
    backgroundColor: "transparent",
  },
  button: {
    padding: 10,
    flex: 1,
    borderTopWidth: 0.3,
  },
  buttonText: {
    textAlign: "center",
  },
});
