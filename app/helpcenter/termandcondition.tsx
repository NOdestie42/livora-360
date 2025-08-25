import React from "react";
import { useRouter } from "expo-router";
import BackArrow from "../../assets/backArrow.svg";
import { View, Text, Pressable } from "react-native";

const TermsAndCondition = () => {
  const router = useRouter();
  return (
    <View className="flex-1 bg-white">
      <View className="w-[90%] mx-auto mt-6">
        <Pressable onPress={() => router.back()}>
          <BackArrow />
        </Pressable>
        <Text className="text-[28px] font-semibold py-4">
          Terms & Conditions
        </Text>
        <View className="flex gap-4">
          <Text className="text-sm font-medium leading-5 text-[#3D3D3D]">
            Viste
          </Text>
          <Text className="text-xs leading-4 text-[#8A8A8A]">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </Text>
          <Text className="text-sm font-medium leading-5 text-[#3D3D3D]">
            Lorem Ipsm Dolor Sit
          </Text>
          <Text className="text-xs leading-4 text-[#8A8A8A]">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TermsAndCondition;
