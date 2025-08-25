import { View, Text, ActivityIndicator } from "react-native";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import EmptyState from "../../assets/EmptyState.svg";
import Spinner from "../Spinner";
import Error from "../Error";
import { UserWalletActivities } from "./request";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";
import { useTranslation } from "react-i18next";

const WalletAvtivity = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user-wallet-activites"],
    queryFn: UserWalletActivities,
  });
  const { t } = useTranslation()
  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <Error error={error} />;
  }

  return (
    <View className="flex items-center justify-center">
      {data && data.length === 0 ? (
        <EmptyState />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          className="w-full h-[57%]"
        >
          {data?.map((value, index) => {
            const startDate = moment.utc(value.endDate);
            const startMonthName = startDate.format("MMMM");
            const startYear = startDate.year();
            const startDay = startDate.date();
            return (
              <View
                key={index}
                className=" my-2 py-2 bg-[#F3F6F6] px-4 rounded-md"
              >
                <View className="flex flex-row items-center justify-between">
                  <View className="flex flex-row items-start gap-1">
                    <Text className="font-semibold">{value.money}</Text>
                    <Text className="text-[10px] font-bold"></Text>
                  </View>
                  {value.method === "deposit" && (
                    <Text className="bg-[#F4FFF2] text-[#1B9E4B] text-[12px] font-medium rounded-full py-[2px] px-2 ">
                      {t("Deposit")}
                    </Text>
                  )}
                  {value.method === "withdraw" && (
                    <Text className="text-[#646464] text-[12px] font-medium rounded-full py-[2px] px-2 bg-[#e9e9e9]">
                      {t("Withdraw")}
                    </Text>
                  )}
                  {value.method === "booking" && (
                    <Text className="text-[#646464] text-[12px] font-medium rounded-full py-[2px] px-2 bg-[#F4FFF2]">
                      {t("Booking")}
                    </Text>
                  )}
                  {value.method === "refund" && (
                    <Text className="text-[#646464] text-[12px] font-medium rounded-full py-[2px] px-2 bg-[#F4FFF2]">
                      {t("Refund")}
                    </Text>
                  )}
                </View>
                <View className="flex flex-row items-center gap-1">
                  <Text className="text-[12px]">
                    {startDay} {startMonthName} {startYear}
                  </Text>
                  <Text className="text-[12px]">{value.status}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

export default WalletAvtivity;
