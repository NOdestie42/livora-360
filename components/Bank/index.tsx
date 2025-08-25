import React from "react";
import { View, Text, Pressable } from "react-native";
import BackArrow from "../../assets/backArrow.svg";
import { useRouter } from "expo-router";
import EmptyCardState from "../../assets/EmptyCardState.svg";
import ListCard from "../../assets/ListCard.svg";
import Plus from "../../assets/Plus.svg";
import Dotsss from "../../assets/DOtsss.svg";
import Deletes from "../../assets/deletes.svg";
import { useQuery } from "@tanstack/react-query";
import { UsercardList } from "./request";
import Spinner from "../Spinner";
import Error from "../Error";
import { useTranslation } from "react-i18next";

const BankComp = () => {
  const router = useRouter();
  const { t } = useTranslation()
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["User-Card-List"],
    queryFn: UsercardList,
  });

  return (
    <View className="flex-1 bg-white">
      <View className="w-[90%] mx-auto mt-6">
        <View className="flex flex-row items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <BackArrow />
          </Pressable>
        </View>

        {isPending ? (
          <View className="flex items-center justify-center h-[90%]">
            <Spinner />
          </View>
        ) : isError ? (
          <View className="flex items-center justify-center h-[90%]">
            <Error error={error} />
          </View>
        ) : !data?.paymentMethods?.length ? (
          <View className="flex items-center justify-center h-[90%]">
            <View className="flex items-center justify-center">
              <EmptyCardState />
              <ListCard />
              <Text className="font-semibold text-xl">{t("Empty Bank & Card")}</Text>
              <Text className="text-center text-sm mt-2">
                {t("Add Bank Or Card First")}
              </Text>
              <Pressable>
                <View className="flex flex-row items-center bg-primary justify-center pl-2 pr-3 py-2 mt-2">
                  <Plus color={"#fff"} />
                  <Text className="font-semibold text-white">{t("Add New")}</Text>
                </View>
              </Pressable>
            </View>
          </View>
        ) : (
          <View className="mt-6">
            <Text className="font-semibold">{t("BankCards")}</Text>
            {data.paymentMethods.map((value, index) => (
              <View
                key={index}
                className="bg-[#FCFCFC] relative p-2 rounded-sm mt-4"
              >
                <View className="absolute right-0">
                  <Dotsss />
                </View>
                <View className="flex flex-row items-center justify-between">
                  <Text className="font-semibold">{value.card.country}</Text>
                  <Pressable>
                    <Deletes />
                  </Pressable>
                </View>
                <View className="mt-6">
                  <Text className="font-bold">
                    {value.card.brand.toLocaleUpperCase()} Card
                  </Text>
                  <Text>**** **** **** {value.card.last4}</Text>
                </View>
                <Text className="font-bold">
                  {value.card.exp_month} / {value.card.exp_year}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

export default BankComp;
