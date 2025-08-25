import Or from "../assets/or.svg";
import CrossSvg from "../assets/cross.svg";
import { useState, useRef, useCallback } from "react";
import SignupLoginForm from "@/components/SignUpLogin";
import QuestionSvg from "../assets/questioncircle.svg";
import { View, Text, Image, Pressable } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import CustomButton from "@/components/CustomButton";

const WelcomeScreen = () => {
  const router = useRouter();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["1%", "90%"];
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const handleBottomSheetOpen = useCallback(() => {
    setIsBottomSheetVisible(true);
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  const handleBottomSheetClose = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleBottomSheetChange = useCallback((index: number) => {
    if (index === 0) {
      setIsBottomSheetVisible(false);
    }
  }, []);


  return (
    <View className="relative flex-1 bg-bgMain pt-4">
      <Image
        className="w-full"
        source={require("../assets/images/loginimage.png")}
      />
      <View className="w-[90%] mx-auto flex items-center justify-center gap-8">
        <CustomButton text="Sign In" onPress={handleBottomSheetOpen} />
        <View className="flex items-center">
          <Or />
        </View>
        <View className="flex flex-row items-center">
          <Text className="font-bold text-textPrimary">Don’t have an account?</Text>
          <Pressable onPress={() => router.push("/finishsignup")}>
            <Text className="text-primary font-extrabold tracking-wider ml-1">
              Sign Up
            </Text>
          </Pressable>
        </View>
      </View>

      {isBottomSheetVisible && (
        <View className="absolute inset-0 z-20">
          <GestureHandlerRootView
            className="flex-1"
            pointerEvents={isBottomSheetVisible ? "auto" : "none"}
          >
            <BottomSheet
              ref={bottomSheetRef}
              snapPoints={snapPoints}
              enablePanDownToClose={true}
              onClose={handleBottomSheetClose}
              animationConfigs={{
                duration: 400,
              }}
              onChange={handleBottomSheetChange}
              style={{
                borderRadius: 25,
              }}
              index={isBottomSheetVisible ? 1 : 0}
              handleIndicatorStyle={{ display: "none" }}
              backgroundStyle={{
                backgroundColor: "white",
                borderRadius: 15,
              }}
            >
              <BottomSheetView className="flex-1 px-6">
                <View className="flex flex-row items-center justify-between">
                  <Pressable onPress={handleBottomSheetClose}>
                    <CrossSvg width={16} height={16} />
                  </Pressable>
                  <QuestionSvg />
                </View>
                <SignupLoginForm />
              </BottomSheetView>
            </BottomSheet>
          </GestureHandlerRootView>
        </View>
      )}
    </View>
  );
};

export default WelcomeScreen;
