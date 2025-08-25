import React from "react";
import { Text, View } from "react-native";
import SearchMain from "@/components/SearchMain";
import LogoBanner from "./../../assets/logo-banner.svg";
import TopBarNavigator from "@/components/TopBarNavigator";

const TabIndex = () => {
  return (
    <View className="flex-1 items-center bg-white">
      <View className="w-full">
        <View className="items-center pt-4">
          <Text className="text-2xl font-bold leading-10 text-[#0582CA]">LIVORA 360</Text>
        </View>
        {/* Top main Search Component  */}
        <SearchMain />

        <View className="h-[79.5%]">
          <TopBarNavigator />
        </View>
      </View>
    </View>
  );
};

export default TabIndex;
