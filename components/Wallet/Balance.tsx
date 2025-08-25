import { View, Text } from "react-native";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { WalletUserData } from "./request";
import { DepositCardlistFucntion } from "../Deposit/request";
import { useCurrency } from "@/utils/CurrencyContext";

const Balance = () => {
  const { data: walletData } = useQuery({
    queryKey: ["wallet-userData"],
    queryFn: WalletUserData,
  });
  const { currency, formatPrice } = useCurrency()
  const { data: CardsData } = useQuery({
    queryKey: ["Deposite-cards-list"],
    queryFn: DepositCardlistFucntion,
  });

  const primaryCard = CardsData?.paymentMethods.find((card) => card.isPrimary === true);

  return (
    <View className="mt-6">
      <View
        className="rounded-2xl p-5 bg-primary"
        style={{
          height: 160,
          borderRadius: 20,
          boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
          justifyContent: "space-between",
        }}
      >
        {/* Top Row */}
        <View className="flex-row justify-between items-center">
          <Text className="text-white font-semibold text-lg">
            {primaryCard?.brand.toLocaleUpperCase() ?? "XXXX"}
          </Text>
        </View>

        {/* Card Number */}
        <View className="my-2">
          <Text className="text-white text-xl tracking-widest font-semibold">
            **** **** **** {primaryCard?.last4 ?? "XXXX"}
          </Text>
        </View>

        {/* Bottom Row */}
        <View className="flex-row justify-between items-end">
          <View>
            <Text className="text-white text-xs">Balance</Text>
            <Text className="text-white text-2xl font-bold">
              {formatPrice(walletData?.wallet as number) ?? "0.00"}
            </Text>
          </View>
          <View>
            <Text className="text-white text-xs">Valid Thru</Text>
            <Text className="text-white font-semibold text-base">
              {primaryCard?.exp_month && primaryCard?.exp_year
                ? `${primaryCard.exp_month}/${String(primaryCard.exp_year).slice(-2)}`
                : "--/--"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Balance;
