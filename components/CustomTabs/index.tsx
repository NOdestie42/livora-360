// components/CustomTabBar.tsx
import React, { memo, useCallback } from "react";
import { SvgProps } from "react-native-svg";
import { View, Text, TouchableOpacity, Image, Platform } from "react-native";
import { RelativePathString, useRouter, useSegments } from "expo-router";
import TabItem from "@/components/TabItem";
import HeartLogo from "../../assets/Heart.svg";
import SearchLogo from "../../assets/Search.svg";
import MessageLogo from "../../assets/Message.svg";
import { Animated } from "react-native";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { fetchProfile } from "../Profile/request";

interface CustomTabBarProps {
  replaceTab?: {
    label: string;
    icon: React.ComponentType<SvgProps> | undefined;
    route: string;
    isActive: boolean;
  };
  layoutClasses?: string;
  open?: React.Dispatch<React.SetStateAction<boolean>>
}

const CustomTabBar = memo(({
  replaceTab,
  layoutClasses = "bg-bgMain border-t border-border",
  open
}: CustomTabBarProps) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["whoami"],
    queryFn: fetchProfile,
  });

  const router = useRouter();
  const { t } = useTranslation()
  const segments = useSegments() as string[];
  const profileActive = segments.includes("profile");
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 2,
      useNativeDriver: true,
    }).start();
    open?.(true)
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View className="w-full absolute bottom-0">
      <View
        className={`flex items-center flex-row gap-x-5 ${layoutClasses} py-3`}
      >
        <TabItem
          Icon={SearchLogo}
          label={t("Explore")}
          isWhite={replaceTab ? true : false}
          isActive={segments.includes("House")}
          onPress={() => router.push("/(tabs)")}
        />

        {replaceTab ? (
          <TouchableOpacity
            onPress={() => router.push(replaceTab.route as RelativePathString)}
            accessibilityRole={Platform.OS === "web" ? "link" : "button"}
            className="flex-1 items-center justify-center gap-1"
          >
            {replaceTab.icon &&
              React.createElement(replaceTab.icon, { color: "#fff" })}
            <Text className={`text-[7px] text-white`}>{t(replaceTab.label)}</Text>
          </TouchableOpacity>
        ) : (
          <TabItem
            Icon={HeartLogo}
            label={t("WishLists")}
            isWhite={replaceTab ? true : false}
            isActive={segments.includes("wishlists")}
            onPress={() => router.push("/(tabs)/wishlists")}
          />
        )}


        <TouchableOpacity
          activeOpacity={1}
          onLongPress={handlePressIn}
          onPressOut={handlePressOut}
          className="relative bottom-4 items-center justify-center"
        >
          <Animated.View
            style={{
              transform: [{ scale: scaleValue }],
              width: 56,
              height: 56,
            }}
          >
            <Image
              source={require("../../assets/images/ai.png")}
              style={{ width: "100%", height: "100%" }}
            />
          </Animated.View>
        </TouchableOpacity>
        <TabItem
          Icon={MessageLogo}
          label={t("Inbox")}
          isWhite={replaceTab ? true : false}
          isActive={segments.includes("inbox")}
          onPress={() => router.push("/(tabs)/inbox")}
        />
        <TouchableOpacity
          className="flex-1 items-center justify-center gap-1"
          onPress={() => router.push("/(tabs)/profile")}
        >
          <Image
            source={data?.profilePic ? { uri: data?.profilePic } : require('../../assets/defaultPic.jpg')}
            style={{
              width: 20,
              height: 20,
              borderRadius: 15,
            }}
          />
          <Text
            className={`text-[7px] ${profileActive
              ? "text-primary"
              : replaceTab
                ? "text-textInverted"
                : "text-textSecondary"
              }`}
          >
            {t("Profile")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});


export default CustomTabBar;
