import React from "react";
import BackArrow from "../../assets/backArrow.svg";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";

const PasswordComp = () => {
  const router = useRouter();
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 w-[90%] mx-auto mt-6 justify-between pb-4">
        <View>
          <Pressable onPress={() => router.back()}>
            <BackArrow />
          </Pressable>
          <Text className="text-[28px] font-semibold py-4">Reset Password</Text>
          <View className="mt-2">
            <CustomInput placeholder="Enter your email" />
          </View>
        </View>
        <CustomButton
          onPress={() => router.push("/accountdetails/otpverify")}
          text="Confirm"
        />
      </View>
    </View>
  );
};

export default PasswordComp;
