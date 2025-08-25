import { View, Text } from "react-native";
import React from "react";

const Error = ({ error }: { error: Error | null }) => {
  return (
    <View className="flex-1 justify-center items-center">
      <Text style={{ color: "red" }}>
        Error: {error?.message || "Something went wrong"}
      </Text>
    </View>
  );
};

export default Error;
