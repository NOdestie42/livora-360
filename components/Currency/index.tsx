import React, { useState } from "react";
import { useRouter } from "expo-router";
import BackArrow from "../../assets/backArrow.svg";
import AmericanFlag from "../../assets/americanflag.svg";
import TickIcon from "../../assets/whiteTick.svg";
import { View, Text, Pressable, TouchableOpacity, Image } from "react-native";
import { useCurrency } from "@/utils/CurrencyContext";

const CurrencyComp = () => {
  const router = useRouter();
  const { currency, setCurrencyToEuro, setCurrencyToUSD } = useCurrency();
  const [checked, setChecked] = useState(currency === "USD" ? "american" : "es");


  const handleSelect = (value: string) => {
    setChecked(value);
    if (value === "american") setCurrencyToUSD();
    if (value === "es") setCurrencyToEuro();
  };

  const CustomRadioButton = ({ value }: { value: string }) => (
    <TouchableOpacity
      onPress={() => handleSelect(value)}
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
    <View className="flex-1 bg-bgMain">
      <View className="w-[90%] mx-auto mt-6">
        <Pressable onPress={() => router.back()}>
          <BackArrow />
        </Pressable>
        <Text className="text-[28px] font-semibold py-4 text-textPrimary">Currency</Text>

        <Text className="font-medium text-[#3D3D3D] mb-4">Select Currency</Text>
        <View className="flex flex-col gap-4">
          {/* English */}
          <View className="flex flex-row items-center justify-between border-b border-[#E5E5E5] pb-6 pt-2">
            <View className="flex flex-row items-center gap-2">
              <AmericanFlag />
              <Text className="font-bold">English  <Text className="font-extralight">($)</Text></Text>
            </View>
            <CustomRadioButton value="american" />
          </View>

          {/* Spanish */}
          <View className="flex flex-row items-center justify-between">
            <View className="flex flex-row items-center gap-2">
              <Image
                className="rounded-sm"
                source={require("../../assets/spainflag.png")}
                style={{ width: 26, height: 18 }}
              />
              <Text className="font-bold">Spanish <Text className="font-extralight">(€)</Text></Text>
            </View>
            <CustomRadioButton value="es" />
          </View>
        </View>
      </View>
    </View>
  );
};

export default CurrencyComp;
