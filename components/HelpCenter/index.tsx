import React from "react";
import { useRouter } from "expo-router";
import BackArrow from "../../assets/backArrow.svg";
import ForwardArrow from "../../assets/forwardArrow.svg";
import { View, Text, Pressable } from "react-native";
import VerticalBarLines from "../../assets/VerticalBarLines.svg";

const HelpCenterComp = () => {
  const router = useRouter();
  return (
    <View className="flex-1 bg-white">
      <View className="w-[90%] mx-auto mt-6">
        <Pressable onPress={() => router.back()}>
          <BackArrow />
        </Pressable>
        <Text className="text-[28px] font-semibold py-4">Help Center</Text>
        <View className="flex flex-col gap-3">
          <Pressable onPress={() => router.push("/helpcenter/faqs")}>
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center gap-2">
                <VerticalBarLines width={35} height={35} />
                <Text className="font-bold">FAQs</Text>
              </View>
              <ForwardArrow width={12} height={12} />
            </View>
          </Pressable>
          <Pressable
            onPress={() => router.push("/helpcenter/termandcondition")}
          >
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center gap-2">
                <VerticalBarLines width={35} height={35} />
                <Text className="font-bold">Terms & Conditions</Text>
              </View>
              <ForwardArrow width={12} height={12} />
            </View>
          </Pressable>
          <Pressable onPress={() => router.push("/helpcenter/contactus")}>
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center gap-2">
                <VerticalBarLines width={35} height={35} />
                <Text className="font-bold">Contact Us</Text>
              </View>
              <ForwardArrow width={12} height={12} />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default HelpCenterComp;
