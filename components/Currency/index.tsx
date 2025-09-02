import React, { useState } from "react";
import { useRouter } from "expo-router";
import BackArrow from "../../assets/backArrow.svg";
import AmericanFlag from "../../assets/americanflag.svg";
import TickIcon from "../../assets/whiteTick.svg";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useCurrency } from "@/utils/CurrencyContext";
import { useTranslation } from "react-i18next";

const CurrencyComp = () => {
  const router = useRouter();
  const { t } = useTranslation()
  const { currency, setCurrencyToEuro, setCurrencyToUSD } = useCurrency();
  const [checked, setChecked] = useState(currency);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (value: "USD" | "EUR") => {
    if (value === checked) return;
    setLoading(true);

    try {
      setChecked(value);
      if (value === "USD") await setCurrencyToUSD();
      if (value === "EUR") await setCurrencyToEuro();
      setTimeout(() => {
        setLoading(false);
      }, 600);
    } catch (e) {
      setLoading(false);
    }
  };

  const CurrencyRow = ({
    value,
    label,
    icon,
  }: {
    value: "USD" | "EUR";
    label: string;
    icon: React.ReactNode;
  }) => {
    const isActive = checked === value;

    return (
      <TouchableOpacity
        onPress={() => handleSelect(value)}
        activeOpacity={0.8}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingVertical: 14,
          paddingHorizontal: 12,
          borderRadius: 12,
          backgroundColor: checked === value ? "#E6F3FF" : "#FAFAFA",
          marginBottom: 12,
          opacity: loading && checked !== value ? 0.6 : 1, // slight feedback
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
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

        {/* Radio with animation */}
        <View
          style={{
            width: 26,
            height: 26,
            borderRadius: 6,
            backgroundColor: isActive ? "#0582CA" : "#EEE",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isActive && (
            <TickIcon width={14} height={14} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-bgMain">
      <View className="w-[90%] mx-auto mt-6">
        <Pressable onPress={() => router.back()} className="mb-4">
          <BackArrow />
        </Pressable>

        <Text className="text-[28px] font-semibold py-4 text-textPrimary">
          Currency
        </Text>

        <Text className="font-medium text-[#3D3D3D] mb-4">
          Select Currency
        </Text>

        {/* USD */}
        <CurrencyRow
          value="USD"
          label="US Dollar ($)"
          icon={<AmericanFlag />}
        />

        {/* EUR */}
        <CurrencyRow
          value="EUR"
          label="Euro (€)"
          icon={
            <Image
              source={require("../../assets/spainflag.png")}
              style={{ width: 26, height: 18, borderRadius: 3 }}
            />
          }
        />
      </View>

      {/* Loading overlay */}
      {loading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator size="large" color="#0582CA" />
          <Text style={{ marginTop: 10, color: "#111", fontSize: 16 }}>
            {t("SwitchingLanguage...")}
          </Text>
        </View>
      )}
    </View>
  );
};

export default CurrencyComp;
