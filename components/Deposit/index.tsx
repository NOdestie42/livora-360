import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import Balance from "../Wallet/Balance";
import BackArrow from "../../assets/backArrow.svg";
import { useRouter } from "expo-router";
import { TextInput } from "react-native-gesture-handler";
import InfoIcon from "../../assets/infoIcon.svg";
import Plus from "../../assets/Plus.svg";
import EmptyCardState from "../../assets/EmptyCardState.svg";
import ListCard from "../../assets/ListCard.svg";
import DepositCardList from "./DepositCardList";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DepositCardlistFucntion, IntentSave, PaymentSheetSetup } from "./request";
import Spinner from "../Spinner";
import Error from "../Error";
import { initPaymentSheet, presentPaymentSheet } from "@stripe/stripe-react-native";
import Toast from "react-native-toast-message";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/utils/CurrencyContext";

const DepositComp = () => {
  const router = useRouter();
  const { t } = useTranslation()
  const [value, setValue] = useState("0");
  const queryClient = useQueryClient();
  const { currency, formatPrice } = useCurrency()
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["Deposite-cards-list"],
    queryFn: DepositCardlistFucntion,
  });

  const { data: PaymentData, isLoading: isPaymentLoading, isError: isPaymentError, error: paymentError } = useQuery({
    queryKey: ['payment-sheet-setup'],
    queryFn: PaymentSheetSetup
  })

  const { mutate } = useMutation({
    mutationKey: ['intent-save'],
    mutationFn: (setupIntentId: string) => IntentSave(setupIntentId),
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Card Added Successfull",
      });
      queryClient.invalidateQueries({ queryKey: ['Deposite-cards-list'] });
    }
  })

  if (isPaymentError) {
    console.log(paymentError)
  }
  const openStripeSheet = async () => {
    if (!PaymentData?.clientSecret || !PaymentData?.setupIntentId) {
      console.error("Missing setup intent data");
      return;
    }

    const { clientSecret, setupIntentId } = PaymentData;

    const init = await initPaymentSheet({
      setupIntentClientSecret: clientSecret,
      merchantDisplayName: "Livora",
    });

    if (init.error) {
      Toast.show({
        type: "error",
        text1: "Error while adding card",
        text2: init.error.message,
      });
      return;
    }

    const result = await presentPaymentSheet();

    if (result.error) {
      if (result.error.code === 'Canceled') {
        return;
      }
      console.error("Stripe Present Error:", result.error.message);
      return;
    }
    mutate(setupIntentId);
  };



  return (
    <View className="flex-1 bg-white">
      <View className="w-[90%] mx-auto mt-6">
        <View className="flex flex-row items-center justify-between">
          <Pressable onPress={() => router.back()}>
            <BackArrow />
          </Pressable>
          <Text className="font-semibold text-lg">{t("Deposit")}</Text>
          <View></View>
        </View>
        <Balance />
        <Text className="text-[11px] py-2">
          {t("Max Deposit")}
        </Text>
        <View className="w-full border-b border-[#D0D5DD] relative">
          <InfoIcon
            style={{
              position: "absolute",
              right: 2,
              top: 12,
            }}
          />
          <TextInput
            inputMode="numeric"
            className="py-2"
            maxLength={500000}
            value={value}
            onChangeText={setValue}
            placeholder="Enter your deposit (e.g 100 USD)"
          />
        </View>
        <View className="flex flex-row items-center justify-between mt-3">
          <Pressable onPress={() => setValue(formatPrice(100))}>
            <Text
              className={`${value === formatPrice(100)
                ? "bg-primary text-white"
                : "bg-[#F6F6F6] text-[#858585]"
                }  p-3 text-xs`}
            >
              {formatPrice(100)} {currency}
            </Text>
          </Pressable>

          <Pressable onPress={() => setValue(formatPrice(500))}>
            <Text
              className={`${value === formatPrice(500)
                ? "bg-primary text-white"
                : "bg-[#F6F6F6] text-[#858585]"
                }  p-3 text-xs`}
            >
              {formatPrice(500)} {currency}
            </Text>
          </Pressable>

          <Pressable onPress={() => setValue(formatPrice(1000))}>
            <Text
              className={`${value === formatPrice(1000)
                ? "bg-primary text-white"
                : "bg-[#F6F6F6] text-[#858585]"
                }  p-3 text-xs`}
            >
              {formatPrice(1000)} {currency}
            </Text>
          </Pressable>

          <Pressable onPress={() => setValue(formatPrice(2500))}>
            <Text
              className={`${value === formatPrice(2500)
                ? "bg-primary text-white"
                : "bg-[#F6F6F6] text-[#858585]"
                }  p-3 text-xs`}
            >
              {formatPrice(2500)} {currency}
            </Text>
          </Pressable>
        </View>
        {isLoading || isPaymentLoading ? (
          <Spinner />
        ) : isError ? (
          <Error error={error} />
        ) : !data?.paymentMethods?.length ? (
          <View className="flex items-center justify-center">
            <EmptyCardState />
            <ListCard />
            <Text className="font-semibold text-xl">{t("Empty Bank & Card")}</Text>
            <Text className="text-center text-sm mt-2">
              {t("Please add a bank or card first to continue depositing your money")}
            </Text>
            <Pressable>
              <View className="flex flex-row items-center bg-primary justify-center pl-2 pr-3 py-2 mt-2">
                <Plus color={"#fff"} />
                <Text className="font-semibold text-white">Add New</Text>
              </View>
            </Pressable>
          </View>
        ) : (
          <>
            <View className="flex flex-row items-center justify-between mt-6">
              <Text className="font-semibold">{t("Cards")}</Text>
              <Pressable className="flex flex-row items-center" onPress={openStripeSheet}>
                <Plus color={"#0582CA"} />
                <Text className="font-semibold text-primary">{t("Add New")}</Text>
              </Pressable>
            </View>
            <DepositCardList data={data} value={value} />
          </>
        )}
      </View>
    </View>
  );
};

export default DepositComp;
