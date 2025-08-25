import { View, Text, Pressable } from "react-native";
import React, { ReactNode, memo, useCallback } from "react";

interface CustomButtonProps {
  text: ReactNode;
  disable?: boolean;
  onPress?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  className?: string
}

const CustomButton = memo(({
  text,
  disable,
  onPress,
  variant = 'primary',
  size = 'medium',
  className,
}: CustomButtonProps) => {
  const handlePress = useCallback(() => {
    if (!disable && onPress) {
      onPress();
    }
  }, [disable, onPress]);

  const getButtonStyles = () => {
    const baseStyles = `w-full rounded-md ${className}`;
    const sizeStyles = {
      small: "py-2 px-4",
      medium: "py-3 px-5",
      large: "py-4 px-6",
    };
    const variantStyles = {
      primary: disable ? "bg-textMuted" : "bg-buttonPrimary",
      secondary: disable ? "bg-textMuted" : "bg-buttonSecondary",
    };

    return `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]}`;
  };

  const getTextStyles = () => {
    const baseStyles = "text-center font-extrabold tracking-wider";
    const textColor = disable ? "text-textInverted" : "text-textInverted";
    return `${baseStyles} ${textColor}`;
  };

  return (
    <Pressable
      disabled={disable}
      className={`w-full`}
      onPress={handlePress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <View className={getButtonStyles()}>
        <Text className={getTextStyles()}>
          {text}
        </Text>
      </View>
    </Pressable>
  );
});

export default CustomButton;
