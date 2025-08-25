import { View, Text, TextInput } from "react-native";
import React, { useRef } from "react";

type CustomOtpInputProps = {
  length?: number;
  value: string;
  setValue: (value: string) => void;
};

const CustomOtpInput = ({
  length = 4,
  value,
  setValue,
}: CustomOtpInputProps) => {
  const inputs = useRef<Array<TextInput | null>>(Array(length).fill(null));

  const handleChange = (text: string, index: number) => {
    if (text.length > 1) return;

    const newOtp = [...value];
    newOtp[index] = text;
    setValue(newOtp.join(""));

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (text: string, index: number) => {
    if (!text && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };
  return (
    <View className="flex flex-row justify-between gap-4">
      {Array.from({ length }).map((_, index) => (
        <TextInput
          className="bg-bgSection rounded-md font-semibold text-base w-10 h-10 text-center text-textPrimary border border-border focus:border-focusOutline"
          key={index}
          ref={(el) => (inputs.current[index] = el)}
          value={value[index] || ""}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={({ nativeEvent }) =>
            nativeEvent.key === "Backspace" &&
            handleBackspace(value[index], index)
          }
          keyboardType="number-pad"
          maxLength={1}
          autoFocus={index === 0}
        />
      ))}
    </View>
  );
};

export default CustomOtpInput;
