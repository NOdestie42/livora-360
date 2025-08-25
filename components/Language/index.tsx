import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { View, Text, Pressable, TouchableOpacity, Image } from "react-native";
import BackArrow from "../../assets/backArrow.svg";
import AmericanFlag from "../../assets/americanflag.svg";
import TickIcon from "../../assets/whiteTick.svg";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LANGUAGE_KEY = "app_language";

const LanguageComp = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const [checked, setChecked] = useState<string>("en");

  // Load saved language on mount
  useEffect(() => {
    const loadLang = async () => {
      const stored = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (stored) {
        setChecked(stored);
        i18n.changeLanguage(stored);
      }
    };
    loadLang();
  }, []);

  // Save + apply when changed
  const handleChange = async (value: string) => {
    setChecked(value);
    await AsyncStorage.setItem(LANGUAGE_KEY, value);
    i18n.changeLanguage(value);
  };

  const CustomRadioButton = ({ value }: { value: string }) => (
    <TouchableOpacity
      onPress={() => handleChange(value)}
      style={{
        width: 24,
        height: 24,
        borderRadius: 4,
        backgroundColor: checked === value ? "#0582CA" : "#F0F0F0",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {checked === value && <TickIcon width={14} height={14} />}
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <View className="w-[90%] mx-auto mt-6">
        <Pressable onPress={() => router.back()}>
          <BackArrow />
        </Pressable>

        {/* <Text className="text-lg font-semibold mt-4">{t("hello")}</Text> */}

        <Text className="text-[28px] font-semibold py-4">{t("Language")}</Text>
        <Text className="font-medium text-[#3D3D3D] mt-2 mb-4">
          {t("All Languages")}
        </Text>

        <View className="flex flex-col gap-4">
          {/* English */}
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-2">
              <AmericanFlag />
              <Text className="font-bold">English</Text>
            </View>
            <CustomRadioButton value="en" />
          </View>

          {/* Spanish */}
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-2">
              <Image
                source={require("../../assets/spainflag.png")}
                style={{ width: 26, height: 18 }}
              />
              <Text className="font-bold">Spanish</Text>
            </View>
            <CustomRadioButton value="es" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default LanguageComp;
