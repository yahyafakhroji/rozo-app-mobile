import { useColorScheme } from "nativewind";
import React, { useMemo } from "react";
import {
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { getNumpadSize, moderateScale, spacing } from "@/libs/responsive";
import { rawColors } from "@/libs/design-system";

export interface NumPadProps {
  onPress: (value: string) => void;
  decimalSeparator?: "." | ",";
  buttonStyle?: ViewStyle;
  buttonTextStyle?: TextStyle;
  containerStyle?: ViewStyle;
}

const dialPadContent = [1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0, "X"];

export const NumPad: React.FC<NumPadProps> = ({
  onPress,
  decimalSeparator = ".",
  buttonStyle,
  buttonTextStyle,
  containerStyle,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? rawColors.dark : rawColors.light;

  // Responsive sizes
  const { buttonSize, fontSize, gap } = useMemo(() => getNumpadSize(), []);

  const defaultButtonStyle: ViewStyle = useMemo(
    () => ({
      width: buttonSize,
      height: buttonSize,
      borderRadius: buttonSize / 2,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      marginVertical: gap / 2,
      marginHorizontal: gap / 2,
      shadowColor: isDark ? "rgba(0, 0, 0, 0.3)" : "rgba(0, 0, 0, 0.1)",
      shadowOffset: { width: 0, height: moderateScale(2) },
      shadowOpacity: 1,
      shadowRadius: moderateScale(4),
      elevation: 3,
      borderWidth: 1.5,
      borderColor: colors.border,
    }),
    [buttonSize, gap, colors, isDark]
  );

  const defaultButtonTextStyle: TextStyle = useMemo(
    () => ({
      fontSize,
      fontWeight: "600",
      color: colors.text,
    }),
    [fontSize, colors]
  );

  const defaultContainerStyle: ViewStyle = useMemo(
    () => ({
      flexDirection: "column",
      padding: spacing.lg,
      backgroundColor: colors.backgroundSecondary,
      borderTopLeftRadius: moderateScale(16),
      borderTopRightRadius: moderateScale(16),
    }),
    [colors]
  );

  const handlePress = (item: string | number) => {
    if (item === "X") {
      onPress("delete");
    } else if (item === ".") {
      onPress(decimalSeparator);
    } else if (item === 0) {
      onPress("0");
    } else if (typeof item === "number") {
      onPress(item.toString());
    } else {
      onPress(item);
    }
  };

  // Create rows for 3-column layout
  const rows = useMemo(() => {
    const result = [];
    for (let i = 0; i < dialPadContent.length; i += 3) {
      result.push(dialPadContent.slice(i, i + 3));
    }
    return result;
  }, []);

  return (
    <View style={[defaultContainerStyle, containerStyle]}>
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            marginBottom: gap,
          }}
        >
          {row.map((item, colIndex) => (
            <TouchableOpacity
              key={`${rowIndex}-${colIndex}`}
              onPress={() => handlePress(item)}
              style={[defaultButtonStyle, buttonStyle]}
              activeOpacity={0.7}
            >
              <Text style={[defaultButtonTextStyle, buttonTextStyle]}>
                {item === "X" ? "⌫" : item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};
