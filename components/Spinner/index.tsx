import { View, Text, ActivityIndicator } from "react-native";
import React from "react";

const Spinner = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#0582CA" />
      <Text>Loading...</Text>
    </View>
  );
};

export default Spinner;
