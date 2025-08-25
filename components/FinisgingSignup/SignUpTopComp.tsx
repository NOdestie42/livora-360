import { View, Text, Pressable } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import Back from "../../assets/Back.svg";

interface FinishingSignUpProps {
  setStep: Dispatch<SetStateAction<number>>;
}

const FinishingSignUp: React.FC<FinishingSignUpProps> = ({ setStep }) => {
  return (
    <View className="w-full h-[44px] flex flex-row items-center justify-between">
      <Pressable onPress={() => setStep((prev) => prev - 1)}>
        <Back />
      </Pressable>
      <Text className="font-semibold ">Finish signing up</Text>
      <View></View>
    </View>
  );
};

export default FinishingSignUp;
