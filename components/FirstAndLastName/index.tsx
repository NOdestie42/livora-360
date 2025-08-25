import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import { SignUpComProps } from "@/types";
import FinishingSignUp from "../FinisgingSignup/SignUpTopComp";
import Toast from "react-native-toast-message";

const FirstAndLastName = ({ userInfo, setStep, onNext }: SignUpComProps) => {
  const [firstName, setFirstName] = useState(userInfo.firstName || "");
  const [lastName, setLastName] = useState(userInfo.lastName || "");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!firstName || !lastName) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setStep((prev) => prev + 1);
    onNext({ firstName, lastName });
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
        <CustomInput
          placeholder="First name"
          value={firstName}
          onChangeText={setFirstName}
        />

        <View className="w-full">
          <CustomInput
            placeholder="Last name"
            value={lastName}
            onChangeText={setLastName}
          />
          <Text className="text-sm text-textSecondary px-1 mt-1">
            Make sure it matches the name on your government ID.
          </Text>
        </View>
        <CustomButton text="Next" onPress={handleNext} />
      </View>
    </View>
  );
};

export default FirstAndLastName;
