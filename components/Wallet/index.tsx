import { View, Text, Pressable } from "react-native";
import React from "react";
import BackArrow from "../../assets/backArrow.svg";
import WidthDraw from "../../assets/widthdraw.svg";
import Deposite from "../../assets/deposite.svg";
import BankAndCard from "../../assets/bankAndCard.svg";
import BitCoin from "../../assets/bitCoin.svg";

import { useRouter } from "expo-router";
import Balance from "./Balance";
import WalletAvtivity from "./WalletAvtivity";
import { useTranslation } from "react-i18next";

const WalletComp = () => {
  const router = useRouter();
  const { t } = useTranslation()
  return (
    <View className="flex-1 bg-white">
      <View className="w-[90%] mx-auto mt-6">
        <View className="flex flex-row items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <BackArrow />
          </Pressable>
          <Text className="font-semibold text-lg">{t("Wallet")}</Text>
          <View></View>
        </View>
        <Balance />
        <View
          className="mt-4 flex flex-row items-center justify-between bg-white py-3 px-3 rounded-md"
          style={{
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 1,
            shadowRadius: 12,
            elevation: 2,
          }}
        >
          <View className="flex items-center justify-center gap-2">
            <WidthDraw />
            <Text className="text-sm">{t("Withdraw")}</Text>
          </View>
          <Pressable onPress={() => router.push("/deposit")}>
            <View className="flex items-center justify-center gap-2">
              <Deposite />
              <Text className="text-sm">{t("Deposit")}</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => router.push("/bank")}>
            <View className="flex items-center justify-center gap-2">
              <BankAndCard />
              <Text className="text-sm">{t("Bank & Card")}</Text>
            </View>
          </Pressable>
        </View>
        <Text className="my-4 font-semibold text-base">{t("Recent Activity")}</Text>
        <WalletAvtivity />
      </View>
    </View>
  );
};

export default WalletComp;
