import { CustomInputProps } from "@/types";
import React, { memo, useState, useCallback } from "react";
import { TextInput } from "react-native-gesture-handler";

type InputSize = 'sm' | 'md' | 'lg';

interface CustomInputWithSize extends CustomInputProps {
  size?: InputSize;
}

const sizeStyles = {
  sm: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  md: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  lg: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 18,
  },
};

const CustomInput = memo(
  ({ placeholder, editable, size = 'md', ...props }: CustomInputWithSize) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = useCallback(() => {
      setIsFocused(true);
      props.onFocus?.();
    }, [props.onFocus]);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
      props.onBlur?.();
    }, [props.onBlur]);

    const getBorderColor = () => {
      return isFocused ? "#0582CA" : "#E0E0E0";
    };

    const { paddingVertical, paddingHorizontal, fontSize } = sizeStyles[size];

    return (
      <TextInput
        {...props}
        showSoftInputOnFocus={editable}
        placeholder={placeholder}
        placeholderTextColor="#999999"
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-full rounded-md border-b text-textPrimary"
        style={{
          borderBottomWidth: 2,
          borderBottomColor: getBorderColor(),
          paddingVertical,
          paddingHorizontal,
          fontSize,
        }}
      />
    );
  }
);

export default CustomInput;
