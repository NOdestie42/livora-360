import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import BackArrow from "../../assets/backArrow.svg";
import Eye from "../../assets/eye.svg";
import HiddenEye from "../../assets/hiddenEye.svg";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";

const ChangePasswordComp = () => {
  const router = useRouter();
  const [isNewSecure, setIsNewSecure] = useState(true);
  const [isRepeatSecure, setIsRepeatSecure] = useState(true);

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 w-[90%] mx-auto mt-6 justify-between pb-4">
        <View>
          <Pressable onPress={() => router.back()}>
            <BackArrow />
          </Pressable>
          <Text className="text-[28px] font-semibold py-4">
            Change Password
          </Text>
          <View className="w-full mt-4">
            <View className="relative">
              <CustomInput
                secureTextEntry={isNewSecure}
                placeholder="New Password"
                // onChangeText={handlePasswordChange}
                // value={password}
              />
              <Pressable
                className="absolute right-3 top-3 p-2"
                onPress={() => setIsNewSecure(!isNewSecure)}
              >
                {isNewSecure ? <Eye /> : <HiddenEye />}
              </Pressable>
            </View>
          </View>
          <View className="w-full mt-6">
            <View className="relative">
              <CustomInput
                secureTextEntry={isRepeatSecure}
                placeholder="Repeat Password"
                // onChangeText={handlePasswordChange}
                // value={password}
              />
              <Pressable
                className="absolute right-3 top-3 p-2"
                onPress={() => setIsRepeatSecure(!isRepeatSecure)}
              >
                {isRepeatSecure ? <Eye /> : <HiddenEye />}
              </Pressable>
            </View>
          </View>
        </View>
        <CustomButton text="Confirm" />
      </View>
    </View>
  );
};

export default ChangePasswordComp;
