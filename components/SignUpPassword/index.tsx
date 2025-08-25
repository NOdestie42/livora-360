import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import CustomInput from "../CustomInput";
import CustomButton from "../CustomButton";
import Eye from "../../assets/eye.svg";
import HiddenEye from "../../assets/hiddenEye.svg";
import { SignUpComProps } from "@/types";
import FinishingSignUp from "../FinisgingSignup/SignUpTopComp";
import TickIcon from "../../assets/check.svg";
import Cross from "../../assets/cross.svg";
import InfoCircle from "../../assets/help-circle.svg";
import Toast from "react-native-toast-message";

const SignUpPassword = ({
  mutate,
  userInfo,
  onNext,
  setStep,
}: SignUpComProps) => {
  const [password, setPassword] = useState(userInfo.password || "");
  const [isSecure, setIsSecure] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [hasNumberSymbol, setHasNumberSymbol] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = (inputPassword: string) => {
    const weakRegex = /^.{6,}$/;
    const mediumRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{10,}$/;
    const hasNumber = /[0-9]/.test(inputPassword);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(inputPassword);
    const hasSpace = /\s/.test(inputPassword);

    if (strongRegex.test(inputPassword)) {
      setPasswordStrength("Strong");
    } else if (mediumRegex.test(inputPassword)) {
      setPasswordStrength("Medium");
    } else if (weakRegex.test(inputPassword)) {
      setPasswordStrength("Weak");
    } else {
      setPasswordStrength("Invalid");
    }

    setHasNumberSymbol(hasNumber && hasSymbol);

    if (hasSpace) {
      setError("Password cannot contain spaces");
    } else {
      setError("");
    }
  };

  const handlePasswordChange = (inputPassword: string) => {
    setPassword(inputPassword);
    validatePassword(inputPassword);
  };

  const handleNext = () => {
    if (!password) {
      setError("Please fill in all fields");
      return;
    } else if (passwordStrength === "Weak" || passwordStrength === "Invalid") {
      setError("Please provide a stronger password");
      return;
    } else {
      onNext({ password });
      mutate && mutate();
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
  return (
    <View>
      <FinishingSignUp setStep={setStep} />
      <View className="flex gap-8 mt-8">
        <View className="w-full">
          <View className="relative">
            <CustomInput
              secureTextEntry={isSecure}
              placeholder="Password"
              onChangeText={handlePasswordChange}
              value={password}
            />
            <Pressable
              className="absolute right-3 top-5 p-2"
              onPress={() => setIsSecure(!isSecure)}
            >
              {isSecure ? <Eye /> : <HiddenEye />}
            </Pressable>
          </View>
        </View>
        {password.length > 1 && (
          <View className="flex gap-2">
            <View className="flex flex-row items-center gap-1">
              <InfoCircle width={22} height={22} />
              <Text
                style={{
                  color:
                    passwordStrength === "Strong"
                      ? "green"
                      : passwordStrength === "Medium"
                      ? "orange"
                      : "red",
                }}
              >
                Password Strength: {passwordStrength}
              </Text>
            </View>

            <View className="flex flex-row items-center gap-2">
              {password.length > 8 ? (
                <TickIcon width={18} height={18} />
              ) : (
                <Cross />
              )}
              <Text
                style={{
                  color: password.length > 8 ? "green" : "red",
                }}
              >
                Must be at least 8 characters
              </Text>
            </View>
            <View className="flex flex-row items-center gap-x-2">
              {hasNumberSymbol ? (
                <TickIcon width={18} height={18} />
              ) : (
                <Cross />
              )}
              <Text
                style={{
                  color: hasNumberSymbol ? "green" : "red",
                }}
              >
                Must have at least one symbol and one number
              </Text>
            </View>
          </View>
        )}

        <Text className="w-max text-sm text-textSecondary px-1 mt-1">
          By selecting Agree and continue, I agree to Viste’s
          <Text className="font-semibold text-[#0A13FF]">
            {" "}
            Terms of Service, Payments Terms of Service{" "}
          </Text>
          and
          <Text className="font-semibold text-[#0A13FF]">
            {" "}
            Nondiscrimination Policy{" "}
          </Text>
          and acknowledge the{" "}
          <Text className="font-semibold text-[#0A13FF]"> Privacy Policy </Text>
        </Text>
        <CustomButton text="Agree and continue" onPress={handleNext} />
      </View>
    </View>
  );
};

export default SignUpPassword;
