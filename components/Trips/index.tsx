import { View, Text, Pressable } from "react-native";
import React from "react";
import BackArrow from "../../assets/backArrow.svg";
import { useRouter } from "expo-router";
import TripNavigator from "../TripsNavigator";

const TripComp = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="w-[90%] mx-auto mt-6">
        <Pressable onPress={() => router.back()}>
          <BackArrow />
        </Pressable>
        <Text className="mt-4 font-semibold text-xl">Trips</Text>

        <View className="h-[92%]">
          <TripNavigator />
        </View>
      </View>
    </View>
  );
};

export default TripComp;
