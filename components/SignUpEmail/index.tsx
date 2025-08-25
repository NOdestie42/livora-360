import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import { SignUpComProps } from "@/types";
import FinishingSignUp from "../FinisgingSignup/SignUpTopComp";
import Toast from "react-native-toast-message";

const SignUpEmail = ({ userInfo, onNext, setStep }: SignUpComProps) => {
  const [email, setEmail] = useState(userInfo.email);
  const [error, setError] = useState("");

  const handleNext = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setError("Please fill in all fields");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setStep((prev) => prev + 1);
    onNext({ email });
  };

  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error,
      });

      setError("");
    }
  }, [error]);

  return (
    <View>
      <FinishingSignUp setStep={setStep} />
      <View className="flex items-center gap-8 mt-8">
        <View className="w-full">
          <CustomInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <Text className="text-sm text-textSecondary px-1 mt-1">
            We’ll email you trip confirmations and receipts.{" "}
          </Text>
        </View>
        <CustomButton text="Next" onPress={handleNext} />
      </View>
    </View>
  );
};

export default SignUpEmail;
