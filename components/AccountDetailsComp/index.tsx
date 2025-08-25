import React from "react";
import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";
import BackArrow from "../../assets/backArrow.svg";
import People from "../../assets/people.svg";
import ForwardArrow from "../../assets/forwardArrow.svg";
import WallerRounded from "../../assets/walletrounded.svg";
import LockDotted from "../../assets/lockdotted.svg";

const AccountDetailsComp = () => {
  const router = useRouter();
  return (
    <View className="flex-1 bg-white">
      <View className="w-[90%] mx-auto mt-6">
        <Pressable onPress={() => router.back()}>
          <BackArrow />
        </Pressable>
        <Text className="text-[28px] font-semibold py-4">Account Details</Text>
        <View className="flex flex-col gap-3">
          <Pressable>
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center gap-2">
                <People width={35} height={35} />
                <Text className="font-bold">Personal Information</Text>
              </View>
              <ForwardArrow width={12} height={12} />
            </View>
          </Pressable>
          <Pressable>
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center gap-2">
                <WallerRounded width={35} height={35} />
                <Text className="font-bold">Payment Method</Text>
              </View>
              <ForwardArrow width={12} height={12} />
            </View>
          </Pressable>
          <Pressable onPress={() => router.push("/accountdetails/password")}>
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center gap-2">
                <LockDotted width={35} height={35} />
                <Text className="font-bold">Password</Text>
              </View>
              <ForwardArrow width={12} height={12} />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default AccountDetailsComp;
