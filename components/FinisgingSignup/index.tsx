import React, { useEffect, useState, useCallback } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import Animated, { SlideInRight, SlideOutLeft } from "react-native-reanimated";
import FirstAndLastName from "@/components/FirstAndLastName";
import DOB from "@/components/DOB";
import SignUpEmail from "@/components/SignUpEmail";
import SignUpPassword from "@/components/SignUpPassword";
import { UserInfoTypes } from "@/types";
import { useMutation } from "@tanstack/react-query";
import signUp from "./request";
import { AxiosError } from "axios";
import Toast from "react-native-toast-message";
import { setItemToAsyncStorage } from "@/AsyncStorage";
type ErrorResponse = {
  msg: string;
};
const FinishingSignUpComp = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(0);
  const [userInfo, setUserInfo] = useState<UserInfoTypes>({
    firstName: "",
    lastName: "",
    birthday: null,
    email: "",
    password: "",
  });

  const handleNext = (data: Partial<UserInfoTypes>) => {
    setUserInfo((prevInfo) => ({ ...prevInfo, ...data }));
  };

  const navigateBasedOnStep = useCallback(() => {
    switch (step) {
      case -1:
        router.push("/welcome");
        break;
      case 4:
        console.log("Final User Info:", userInfo);
        break;
    }
  }, [step, router, userInfo]);

  useEffect(() => {
    navigateBasedOnStep();
  }, [navigateBasedOnStep]);

  const { mutate } = useMutation({
    mutationFn: () => signUp(userInfo),
    onSuccess: () => {
      console.log("Signup Successful");
      Toast.show({
        type: "success",
        text1: "Signup Successful",
        text2: "Now login with youre credentials to use app",
      });

      setTimeout(() => {
        router.push("/welcome");
      }, 2000);
    },

    onError: (error: AxiosError) => {
      if (error.response?.data) {
        const data = error.response.data as ErrorResponse;
        Toast.show({
          type: "error",
          text1: "Error",
          text2: data.msg,
        });
      }
    },
  });

  const steps = [
    <FirstAndLastName
      key="1"
      userInfo={userInfo}
      setStep={setStep}
      onNext={handleNext}
    />,
    <DOB key="2" userInfo={userInfo} setStep={setStep} onNext={handleNext} />,
    <SignUpEmail
      key="3"
      userInfo={userInfo}
      setStep={setStep}
      onNext={handleNext}
    />,
    <SignUpPassword
      mutate={mutate}
      key="4"
      userInfo={userInfo}
      setStep={setStep}
      onNext={handleNext}
    />,
  ];
  return (
    <View className="bg-white flex-1">
      <View className="w-[90%] mx-auto">
        <Animated.View
          entering={SlideInRight}
          exiting={SlideOutLeft}
          key={step}
        >
          {steps[step]}
        </Animated.View>
      </View>
    </View>
  );
};

export default FinishingSignUpComp;
