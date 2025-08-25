import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";

import Divider from "../../assets/Divider.svg";
import Phone from "../../assets/phone.svg";
import IPhoneLogo from "../../assets/iPhone.svg";
import FaceBook from "../../assets/fb.svg";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import Eye from "../../assets/eye.svg";
import HiddenEye from "../../assets/hiddenEye.svg";
import GoogleIcon from '../../assets/google.svg';
import Toast from "react-native-toast-message";
import { useMutation } from "@tanstack/react-query";
import loginUser from "./request";
import { AxiosError } from "axios";
import { setItemToAsyncStorage } from "@/AsyncStorage";
import { useRouter } from "expo-router";

type ErrorResponse = {
  message: string;
  success: boolean;
};

const SignupLoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSecure, setIsSecure] = useState(true);
  const [isloading, setIsloading] = useState(false)
  const handleContinue = () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    } else {
      mutate();
    }
    setError("");
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

  const data = {
    email,
    password,
  };

  const { mutate } = useMutation({
    mutationKey: ["login"],
    onMutate: () => {
      setIsloading(true)
    },
    mutationFn: () => loginUser(data),
    onSuccess: (data) => {
      // Toast.show({
      //   type: "success",
      //   text1: "Login Successful",
      //   text2: "Now login with youre credentials to use app",
      // });
      setItemToAsyncStorage("userToken", data.token);
      setItemToAsyncStorage("userId", data.userId);
      setIsloading(false);
      router.push("/(tabs)");
    },
    onError: (error: AxiosError) => {
      if (error.response?.data) {
        const data = error.response.data as ErrorResponse;
        Toast.show({
          type: "error",
          text1: "Error",
          text2: data.message,
        });
        setIsloading(false);
      }
    },
  });

  return (
    <View>
      <View className="my-8">
        <Text className="text-xl my-4 text-center font-semibold text-black">
          Login or Signup
        </Text>
      </View>

      <View className="flex items-center gap-10 pb-8">
        <View className="flex items-center gap-4 w-full">
          <CustomInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
          />
          <View className="w-full">
            <CustomInput
              value={password}
              secureTextEntry={isSecure}
              onChangeText={setPassword}
              placeholder="Password"
            />
            <Pressable
              className="absolute right-3 top-3 p-2"
              onPress={() => setIsSecure(!isSecure)}
            >
              {isSecure ? <Eye /> : <HiddenEye />}
            </Pressable>
          </View>
          <CustomButton text={isloading ? <ActivityIndicator size="small" color="#fff" /> : 'Continue'} onPress={handleContinue} />
        </View>
        <View>
          <Divider />
        </View>
        <View className="flex gap-3 items-center">
          <View className="border rounded-md border-[#E2E8F0]  w-full py-[10px] px-4 flex flex-row items-center justify-between">
            <Phone />
            <Text className="text-center font-semibold text-black">
              Continue with Phone
            </Text>
            <View></View>
          </View>
          <View className="border rounded-md border-[#E2E8F0] w-full py-[10px] px-4 flex flex-row items-center justify-between">
            <IPhoneLogo />
            <Text className="text-center font-semibold text-black">
              Continue with Apple
            </Text>
            <View></View>
          </View>
          <View className="border rounded-md border-[#E2E8F0] w-full py-[10px] px-4 flex flex-row items-center justify-between">
            <GoogleIcon />
            <Pressable>
              <Text className="text-center font-semibold text-black">
                Continue with Google
              </Text>
            </Pressable>
            <View></View>
          </View>
          <View className="border rounded-md border-[#E2E8F0] w-full py-[10px] px-4 flex flex-row items-center justify-between">
            <FaceBook />
            <Text className="text-center font-semibold text-black">
              Continue with Facebook
            </Text>
            <View></View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignupLoginForm;
