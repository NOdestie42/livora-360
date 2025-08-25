import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import BackArrow from "../../assets/backArrow.svg";
import ForwardArrow from "../../assets/forwardArrow.svg";
import Currency from "../../assets/roundedCurrency.svg";
import Globe from "../../assets/globe.svg";
import HeadPhones from "../../assets/roundedHeadphone.svg";
import { useTranslation } from "react-i18next";

const SettingsComp = () => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <View className="flex-1 bg-white">
      <View className="w-[90%] mx-auto mt-6">
        <Pressable onPress={() => router.back()}>
          <BackArrow />
        </Pressable>
        <Text className="text-[28px] font-semibold py-4">{t("Settings")}</Text>
        <View className="flex flex-col gap-3">
          <Pressable onPress={() => router.push("/settings/language")}>
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center gap-2">
                <Globe width={35} height={35} />
                <Text className="font-bold">{t("Language")}</Text>
              </View>
              <ForwardArrow width={12} height={12} />
            </View>
          </Pressable>
          <Pressable onPress={() => router.push("/settings/currency")}>
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center gap-2">
                <Currency width={35} height={35} />
                <Text className="font-bold">{t("Currency")}</Text>
              </View>
              <ForwardArrow width={12} height={12} />
            </View>
          </Pressable>
          <Pressable>
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center gap-2">
                <HeadPhones width={35} height={35} />
                <Text className="font-bold">{t("Notifications Settings")}</Text>
              </View>
              <ForwardArrow width={12} height={12} />
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default SettingsComp;
