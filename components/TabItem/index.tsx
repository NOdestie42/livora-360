import { Text, TouchableOpacity, Platform } from "react-native";
import React, { memo, useCallback } from "react";
import { TabItemProps } from "@/types";

const TabItem = memo(({ label, isActive, onPress, Icon, isWhite }: TabItemProps) => {
  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  const activeClass = isActive
    ? "text-primary"
    : isWhite
      ? "text-textInverted"
      : "text-textSecondary";

  const getIconColor = () => {
    if (isActive) return "#0582CA"; // primary color
    if (isWhite) return "#FFFFFF"; // textInverted color
    return "#666666"; // textSecondary color
  };

  return (
    <TouchableOpacity
      accessibilityRole={Platform.OS === "web" ? "link" : "button"}
      onPress={handlePress}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 4, // 'gap' is not supported on all RN versions
      }}
      activeOpacity={0.7}
    >
      {Icon && <Icon color={getIconColor()} />}
      <Text
        style={{
          fontSize: 7,
          color: getIconColor(),
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>

  );
});


TabItem.displayName = 'TabItem';

export default TabItem;
