import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
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

  const handleChange = async (value: string, label: string) => {
    setChecked(value);
    await AsyncStorage.setItem(LANGUAGE_KEY, value);
    i18n.changeLanguage(value);

  };

  const CustomRadioButton = ({ value }: { value: string }) => {
    const scaleAnim = new Animated.Value(checked === value ? 1 : 0);

    useEffect(() => {
      Animated.spring(scaleAnim, {
        toValue: checked === value ? 1 : 0,
        useNativeDriver: true,
      }).start();
    }, [checked]);

    return (
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 6,
          backgroundColor: checked === value ? "#0582CA" : "#F0F0F0",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {checked === value && (
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TickIcon width={14} height={14} />
          </Animated.View>
        )}
      </View>
    );
  };

  const LanguageOption = ({
    value,
    label,
    icon,
  }: {
    value: string;
    label: string;
    icon: React.ReactNode;
  }) => (
    <TouchableOpacity
      onPress={() => handleChange(value, label)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 12,
        backgroundColor: checked === value ? "#E6F3FF" : "#FAFAFA",
        marginBottom: 12,
      }}
      activeOpacity={0.8}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        {icon}
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            color: checked === value ? "#0582CA" : "#222",
          }}
        >
          {label}
        </Text>
      </View>
      <CustomRadioButton value={value} />
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <View className="w-[90%] mx-auto mt-6">
        <Pressable onPress={() => router.back()}>
          <BackArrow />
        </Pressable>

        <Text className="text-[28px] font-semibold py-4">{t("Language")}</Text>
        <Text className="font-medium text-[#3D3D3D] mb-6">
          {t("All Languages")}
        </Text>

        <LanguageOption
          value="en"
          label="English"
          icon={<AmericanFlag width={26} height={18} />}
        />
        <LanguageOption
          value="es"
          label="Spanish"
          icon={
            <Image
              source={require("../../assets/spainflag.png")}
              style={{ width: 26, height: 18, borderRadius: 3 }}
            />
          }
        />
      </View>
    </View>
  );
};

export default LanguageComp;
