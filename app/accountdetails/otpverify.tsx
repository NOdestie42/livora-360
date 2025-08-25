import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";
import BackArrow from "../../assets/backArrow.svg";
import OTPVerifySvg from "../../assets/otpverify.svg";
import CustomOtpInput from "@/components/CustomOtpInput";

const OtpVerify = () => {
  const router = useRouter();
  const [otp, setOtp] = useState("");

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 w-[90%] mx-auto mt-6 justify-between pb-4">
        <View>
          <Pressable onPress={() => router.back()}>
            <BackArrow />
          </Pressable>
          <Text className="text-[28px] font-semibold py-4">
            OTP Verification
          </Text>
          <View className="flex items-center justify-center gap-3">
            <OTPVerifySvg />
            <Text className="text-center font-[500] text-sm text-[#090909]">
              Please review the registered email for the password verification
              code.
            </Text>
            <CustomOtpInput length={4} value={otp} setValue={setOtp} />
            <Text className="text-[#090909] text-sm">
              Don’t receive the code?
              <Text className="text-[#00755A] font-semibold"> Resend Code</Text>
            </Text>
          </View>
        </View>
        <CustomButton
          onPress={() => router.push("/accountdetails/changePassword")}
          text="Confirm"
        />
      </View>
    </View>
  );
};

export default OtpVerify;
