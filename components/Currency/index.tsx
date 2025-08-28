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
  Alert,
  Animated,
} from "react-native";
import { useCurrency } from "@/utils/CurrencyContext";

const CurrencyComp = () => {
  const router = useRouter();
  const { currency, setCurrencyToEuro, setCurrencyToUSD } = useCurrency();

  const [checked, setChecked] = useState(currency);
  const [scaleAnim] = useState(new Animated.Value(0)); // for tick animation

  const handleSelect = (value: "USD" | "EUR") => {
    if (value === checked) return; // no reselect

    setChecked(value);
    if (value === "USD") setCurrencyToUSD();
    if (value === "EUR") setCurrencyToEuro();

    // tick icon animation
    scaleAnim.setValue(0);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
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
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 16,
          paddingHorizontal: 14,
          borderRadius: 6,
          marginBottom: 12,
          backgroundColor: isActive ? "#E6F2FB" : "#F9F9F9",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {icon}
          <Text
            style={{
              fontWeight: "bold",
              color: isActive ? "#0582CA" : "#333",
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
            <Animated.View
              style={{
                transform: [{ scale: scaleAnim }],
              }}
            >
              <TickIcon width={14} height={14} />
            </Animated.View>
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
    </View>
  );
};

export default CurrencyComp;
