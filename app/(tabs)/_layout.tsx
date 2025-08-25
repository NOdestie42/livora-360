import {
  getItemFromAsyncStorage,
  removeItemFromAsyncStorage,
} from "@/AsyncStorage";
import { Tabs, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import CustomTabBar from "@/components/CustomTabs";
import Spinner from "@/components/Spinner";
import { Text, View } from "react-native";
import { GestureHandlerRootView, Pressable } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import CrossSvg from "../../assets/cross.svg";
import BotChat from "@/components/BotChat";

const TabLayout = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["1%", "90%"];

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await getItemFromAsyncStorage("userToken");
        console.log(token);

        if (!token) {
          router.push("/welcome");
          return;
        }
        const decodedToken = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          await removeItemFromAsyncStorage("userToken");
          router.push("/welcome");
          return;
        }
      } catch (error) {
        router.push("/welcome");
      } finally {
        setIsLoading(false);
      }
    };
    checkToken();
  }, []);


  const handleBottomSheetClose = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleBottomSheetChange = useCallback((index: number) => {
    if (index === 0) {
      setIsSheetOpen(false);
    }
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {isSheetOpen &&
        <View className="absolute inset-0 z-20">
          <GestureHandlerRootView
            className="flex-1"
            pointerEvents={isSheetOpen ? "auto" : "none"}
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
              index={isSheetOpen ? 1 : 0}
              handleIndicatorStyle={{ display: "none" }}
              backgroundStyle={{
                backgroundColor: "white",
                borderRadius: 15,
              }}
            >
              <BottomSheetView className="flex-1 px-6 h-full">
                <View className="flex flex-row items-center justify-between px-3 py-1 rounded-md">
                  <Text className="text-primary font-semibold text-xl">LIVAI</Text>
                  <Pressable onPress={handleBottomSheetClose}>
                    <CrossSvg width={16} height={16} />
                  </Pressable>
                </View>
                <BotChat />
              </BottomSheetView>
            </BottomSheet>
          </GestureHandlerRootView>
        </View>
      }
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={() => <CustomTabBar open={setIsSheetOpen} />}
      />
    </>
  );
};

export default TabLayout;
