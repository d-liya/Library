/**
 * Themed components
 */

import * as React from "react";
import {
  ScrollView as DefaultScrollView,
  Text as DefaultText,
  View as DefaultView,
  TouchableOpacity as DefaultTouchableOpacity,
  ActivityIndicator as DefaultActivityIndicator,
  TextInput as DefaultTextInput,
  TouchableWithoutFeedback as DefaultTouchableWithoutFeedback,
  KeyboardAvoidingView as DefaultKeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  SafeAreaViewProps,
  SafeAreaView as DefaultSafeAreaView,
} from "react-native-safe-area-context";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import Constants from "expo-constants";
import {
  FontAwesome5 as FAIcons5,
  Ionicons as DefaultIoniconcs,
} from "@expo/vector-icons";
import Typography from "../constants/Typography";
import { imapactHaptic } from "../methods/haptic";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type ScrollViewProps = ThemeProps &
  DefaultScrollView["props"] & { tintColor?: boolean };

export function ScrollView(props: ScrollViewProps) {
  const { style, lightColor, darkColor, tintColor, ...otherProps } = props;
  const backgroundColor = tintColor
    ? useThemeColor({ light: lightColor, dark: darkColor }, "tint")
    : useThemeColor({ light: lightColor, dark: darkColor }, "background");
  return (
    <DefaultScrollView style={[{ backgroundColor }, style]} {...otherProps} />
  );
}

export function SafeAreaScrollView(props: ScrollViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  return (
    <DefaultScrollView
      style={[
        { backgroundColor, paddingTop: Constants.statusBarHeight },
        style,
      ]}
      {...otherProps}
    />
  );
}

export type FontAwesome5Props = ThemeProps &
  React.ComponentProps<typeof FAIcons5>;
export function FontAwesome5(props: FontAwesome5Props) {
  const { lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  return <FAIcons5 color={color} {...otherProps} />;
}

export type IoniconsProps = ThemeProps &
  React.ComponentProps<typeof DefaultIoniconcs>;
export function Ionicons(props: IoniconsProps) {
  const { lightColor, darkColor, color, ...otherProps } = props;
  const _color = color
    ? color
    : useThemeColor({ light: lightColor, dark: darkColor }, "text");
  return <DefaultIoniconcs color={_color} {...otherProps} />;
}

export function SafeAreaViewWithFlex(
  props: React.ComponentProps<typeof DefaultSafeAreaView> & ThemeProps
) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  return (
    <DefaultSafeAreaView
      style={[{ backgroundColor, flex: 1 }, style]}
      {...otherProps}
    />
  );
}

export type TextProps = ThemeProps &
  DefaultText["props"] & { color?: string; text?: keyof typeof Typography };
export function Text(props: TextProps) {
  const { style, lightColor, darkColor, color, text, ...otherProps } = props;
  const themecolor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "text"
  );
  return (
    <DefaultText
      style={[
        { color: color ? color : themecolor },
        style,
        text ? Typography[text] : Typography["bodyText"],
      ]}
      {...otherProps}
    />
  );
}

export type ViewProps = ThemeProps &
  DefaultView["props"] & { tintColor?: boolean; whiten?: boolean };
export function View(props: ViewProps) {
  const { style, lightColor, darkColor, tintColor, whiten, ...otherProps } =
    props;
  const backgroundColor = tintColor
    ? useThemeColor({ light: lightColor, dark: darkColor }, "tint")
    : whiten
    ? useThemeColor({ light: lightColor, dark: darkColor }, "lighter")
    : useThemeColor({ light: lightColor, dark: darkColor }, "background");
  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export type TextInputRefProp = React.Ref<DefaultTextInput> | undefined;
export type TextInputProps = ThemeProps &
  DefaultTextInput["props"] & { tintColor?: boolean } & {
    ref?: TextInputRefProp;
  };
export const TextInput = React.forwardRef(
  (props: TextInputProps, ref?: TextInputRefProp) => {
    const { style, lightColor, darkColor, tintColor, ...otherProps } = props;
    const backgroundColor = tintColor
      ? useThemeColor({ light: lightColor, dark: darkColor }, "tint")
      : useThemeColor({ light: lightColor, dark: darkColor }, "background");

    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
    return (
      <DefaultTextInput
        style={[{ backgroundColor, color }, style]}
        placeholderTextColor="rgb(142,142,147)"
        ref={ref}
        {...otherProps}
      />
    );
  }
);

export type TouchableOpacityProps = ThemeProps &
  DefaultTouchableOpacity["props"] & {
    tintColor?: boolean;
    isHaptic?: boolean;
    whiten?: boolean;
  };
export function TouchableOpacity(props: TouchableOpacityProps) {
  const {
    style,
    lightColor,
    darkColor,
    tintColor,
    whiten,
    isHaptic,
    onLongPress,
    ...otherProps
  } = props;
  const backgroundColor = tintColor
    ? useThemeColor({ light: lightColor, dark: darkColor }, "tint")
    : whiten
    ? useThemeColor({ light: lightColor, dark: darkColor }, "lighter")
    : useThemeColor({ light: lightColor, dark: darkColor }, "background");

  return (
    <DefaultTouchableOpacity
      style={[{ backgroundColor }, style]}
      onLongPress={(e) => {
        if (isHaptic) {
          imapactHaptic("Medium");
        }
        if (onLongPress) {
          onLongPress(e);
        }
      }}
      {...otherProps}
    />
  );
}

export type TouchableWithoutFeedbackProps = ThemeProps &
  DefaultTouchableWithoutFeedback["props"];
export function TouchableWithoutFeedback(props: TouchableWithoutFeedbackProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  return (
    <DefaultTouchableWithoutFeedback
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
}

export type ActivityIndicatorProps = ThemeProps &
  DefaultActivityIndicator["props"];
export function ActivityIndicator(props: ActivityIndicatorProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  return (
    <DefaultActivityIndicator
      style={[{ backgroundColor }, style]}
      {...otherProps}
      size="large"
    />
  );
}

export type KeyboardAvoidingViewProps = ThemeProps &
  DefaultKeyboardAvoidingView["props"] & {
    tintColor?: boolean;
    whiten?: boolean;
  };
export function KeyboardAvoidingView(props: KeyboardAvoidingViewProps) {
  const { style, lightColor, darkColor, tintColor, whiten, ...otherProps } =
    props;
  const backgroundColor = tintColor
    ? useThemeColor({ light: lightColor, dark: darkColor }, "tint")
    : whiten
    ? useThemeColor({ light: lightColor, dark: darkColor }, "lighter")
    : useThemeColor({ light: lightColor, dark: darkColor }, "background");
  return (
    <DefaultKeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );
}
