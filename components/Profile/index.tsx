import {
  View,
  Pressable,
  Text,
  ActivityIndicator,
  Animated,
  ScrollView,
  Image,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import BackArrow from "../../assets/backArrow.svg";
import { fetchProfile } from "./request";
import Globe from "../../assets/globe.svg";
import RoundedHeart from "../../assets/roundedHeart.svg";
import RoundedStar from "../../assets/roundedStar.svg";
import Wallet from "../../assets/wallet.svg";
import Person from "../../assets/people.svg";
import Message from "../../assets/roundedMessage.svg";
import Gallery from "../../assets/gallery.svg";
import RoundedBell from "../../assets/roundedBell.svg";
import RoundedExit from "../../assets/roundedExit.svg";
import RoundedSetting from "../../assets/roundedSetting.svg";
import RoundedHeadphone from "../../assets/roundedHeadphone.svg";
import Reviews from "../../assets/reviews.svg";
import Insights from "../../assets/insights.svg";
import Payments from "../../assets/payment.svg";
import Calenders from "../../assets/calenders.svg";
import MyProperties from "../../assets/my-properties.svg";
import Line_pencil from "../../assets/line_pensil.svg";
import ProfileMenu from "./ProfileMenu";
import { removeItemFromAsyncStorage } from "@/AsyncStorage";
import { useTranslation } from "react-i18next";

const ProfileComp = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);
  const slideAnimation = useRef(new Animated.Value(0)).current;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["whoami"],
    queryFn: fetchProfile,
    enabled: false,
  });

  useEffect(() => {
    refetch();
  }, []);

  const toggleSwitch = () => {
    const toValue = isChecked ? 0 : 1;
    Animated.spring(slideAnimation, {
      toValue,
      useNativeDriver: true,
      friction: 10,
      tension: 40,
    }).start();
    setIsChecked(!isChecked);
  };

  const translateX = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 22],
  });

  const handleLouOut = async () => {
    await removeItemFromAsyncStorage("userToken");
    router.push("/welcome");
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0582CA" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text style={{ color: "red" }}>
          Error: {error?.message || "Something went wrong"}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="w-[90%] mx-auto mt-6 flex-1">
        {/* Header */}
        <View className="flex flex-row items-center justify-between">
          <Pressable
            onPress={
              isChecked
                ? () => router.push("/host/properties")
                : () => router.push("/(tabs)")
            }
          >
            <BackArrow />
          </Pressable>
          <Text className="font-semibold text-lg">{t("Profile")}</Text>
          <View />
        </View>

        {data && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            {/* User Info */}
            <View className="mt-6">
              <View className="flex flex-row items-center justify-between pb-4 border-b border-[#D9D9D9]">
                <View className="flex flex-row items-center gap-4">
                  <Image
                    source={
                      data.profilePic
                        ? { uri: data.profilePic }
                        : require("../../assets/defaultPic.jpg")
                    }
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                    }}
                  />
                  <View>
                    <Text className="text-xl font-semibold">
                      {data.firstName}
                    </Text>
                    <Text className="font-bold">{data.email}</Text>
                  </View>
                </View>
                <Pressable
                  onPress={() => router.push("/edit-profile")}
                  className="p-3"
                >
                  <Line_pencil width={20} height={20} />
                </Pressable>
              </View>

              {/* Switch */}
              <View className="py-4">
                <View className="p-3 bg-[#EFEEEE] flex flex-row items-center justify-between rounded-md">
                  <Text className="font-medium text-base">
                    {t("SwitchToHost")}
                  </Text>
                  <Pressable onPress={toggleSwitch}>
                    <View
                      className={`w-11 h-6 rounded-full relative ${
                        isChecked ? "bg-[#0582CA]" : "bg-[#C4C4C4]"
                      }`}
                    >
                      <Animated.View
                        className="w-4 h-4 bg-white rounded-full absolute top-1"
                        style={{
                          transform: [{ translateX }],
                        }}
                      />
                    </View>
                  </Pressable>
                </View>

                {/* Menus */}
                <View className="flex items-center justify-center gap-3 py-2">
                  {isChecked ? (
                    <>
                      <ProfileMenu
                        onPress={() => router.push("/wallet")}
                        Svg={Wallet}
                        text={t("Wallet")}
                      />
                      <ProfileMenu
                        onPress={() => router.push("/host/properties")}
                        Svg={MyProperties}
                        text={t("MyProperties")}
                      />
                      <ProfileMenu
                        onPress={() => router.push("/")}
                        Svg={Insights}
                        text={t("Insights")}
                      />
                      <ProfileMenu
                        onPress={() => router.push("/")}
                        Svg={Payments}
                        text={t("PaymentsAndPayouts")}
                      />
                      <ProfileMenu
                        onPress={() => router.push("/host/reviews")}
                        Svg={Reviews}
                        text={t("Reviews")}
                      />
                      <ProfileMenu
                        onPress={() => router.push("/host/canlenderSync")}
                        Svg={Calenders}
                        text={t("Calendar Sync")}
                      />
                      <ProfileMenu
                        onPress={() => router.push("/notification")}
                        Svg={RoundedBell}
                        text={t("Notifications")}
                      />
                      <ProfileMenu
                        onPress={() => router.push("/settings")}
                        Svg={RoundedSetting}
                        text={t("Settings")}
                      />
                    </>
                  ) : (
                    <>
                      <ProfileMenu
                        onPress={() => router.push("/wallet")}
                        Svg={Wallet}
                        text={t("Wallet")}
                      />
                      <ProfileMenu
                        onPress={() => router.push("/trips")}
                        Svg={Globe}
                        text={t("Trips")}
                      />
                      <ProfileMenu
                        onPress={() => router.push("/(tabs)/wishlists")}
                        Svg={RoundedHeart}
                        text={t("Favorites")}
                      />
                      <ProfileMenu
                        onPress={() => router.push("/(tabs)/inbox")}
                        Svg={Message}
                        text={t("Messages")}
                      />
                      <ProfileMenu Svg={RoundedStar} text={t("Reviews")} />
                      <ProfileMenu
                        onPress={() => router.push("/accountdetails")}
                        Svg={Person}
                        text={t("AccountDetails")}
                      />
                      <ProfileMenu
                        onPress={() => router.push("/guestshop")}
                        Svg={Gallery}
                        text={t("GuestShop")}
                      />
                      <ProfileMenu
                        onPress={() => router.push("/settings")}
                        Svg={RoundedSetting}
                        text={t("Settings")}
                      />
                      <ProfileMenu
                        onPress={() => router.push("/notification")}
                        Svg={RoundedBell}
                        text={t("Notifications")}
                      />
                    </>
                  )}

                  {isChecked && (
                    <Text className="w-full text-start font-bold">
                      {t("More")}
                    </Text>
                  )}

                  <ProfileMenu
                    onPress={() => router.push("/helpcenter")}
                    Svg={RoundedHeadphone}
                    text={t("Help")}
                  />

                  <View className="w-full flex flex-row items-center justify-between">
                    <Pressable onPress={handleLouOut}>
                      <View className="flex flex-row items-center gap-2">
                        <RoundedExit width={35} height={35} />
                        <Text className="font-bold text-sm">{t("Logout")}</Text>
                      </View>
                    </Pressable>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default ProfileComp;
