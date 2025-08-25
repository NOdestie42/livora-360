import {
  Text,
  ScrollView,
  View,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import Visa from "../../assets/visa.svg";
import MasterCard from "../../assets/mastercard.svg";
import { DepositCardListProp, HandleCardDefaultProps } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  handleCardDefault,
  handleDeleteUserCard,
  handlePayFn,
} from "./request";
import Toast from "react-native-toast-message";
import ThreeDots from "../../assets/ThreeDots.svg";
import Popover from "react-native-popover-view";
import { useTranslation } from "react-i18next";

const DepositCardList = ({ value, data }: DepositCardListProp) => {
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);
  const [primaryCard, setPrimaryCard] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { t } = useTranslation()
  useEffect(() => {
    if (data?.paymentMethods) {
      const primary = data.paymentMethods.find((card) => card.isPrimary);
      if (primary) {
        setPrimaryCard(primary.paymentMethodId);
      }
    }
  }, [data]);

  const { mutate } = useMutation({
    mutationKey: ["wallet-pay"],
    onMutate: () => setLoading(true),
    mutationFn: () => handlePayFn(value, primaryCard),
    onSuccess: () => {
      setLoading(false);
      Toast.show({
        type: "success",
        text1: "Payment Successful",
      });
    },
    onError: (error) => {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: error.message,
      });
    },
  });

  const mutation = useMutation({
    mutationKey: ["primary-change"],
    mutationFn: handleCardDefault,
    onSuccess: () => {
      setOpenPopoverId(null);
      Toast.show({
        type: "success",
        text1: "Primary Changed",
        text2: "Go back and come again to check changes",
      });
      queryClient.invalidateQueries({ queryKey: ['Deposite-cards-list'] })
    },
    onError: (error: Error) => {
      setOpenPopoverId(null);
      Toast.show({
        type: "error",
        text1: error.message,
      });
    },
  });

  const handlePay = () => {
    if (value == "0") {
      Toast.show({
        type: "info",
        text1: "The Price can't be 0",
      });
    } else {
      mutate();
      setLoading(true);
    }
  };

  const handleMakePrimary = (customerId: string, paymentMethodID: string) => {
    const data: HandleCardDefaultProps = {
      customerID: customerId,
      paymentMethodId: paymentMethodID,
    };
    mutation.mutate(data);
  };

  const mutationdelatecard = useMutation({
    mutationFn: handleDeleteUserCard,
    onSuccess: () => {
      setOpenPopoverId(null);
      Toast.show({
        type: "success",
        text1: "Primary Removed",
        text2: "Go back and come again to check changes",
      });
      queryClient.invalidateQueries({ queryKey: ['Deposite-cards-list'] })
    },
    onError: (error: Error) => {
      setOpenPopoverId(null);
      Toast.show({
        type: "error",
        text1: error.message,
      });
    },
  });

  const handleDeleteCards = (customerId: string, paymentMethodID: string) => {
    const data: HandleCardDefaultProps = {
      customerID: customerId,
      paymentMethodId: paymentMethodID,
    };
    mutationdelatecard.mutate(data);
  };

  return (
    <>
      <ScrollView className="max-h-[55%] w-full mt-4">
        {data?.paymentMethods.map((value, index) => (
          <Pressable
            key={index}
            onPress={() => setPrimaryCard(value.paymentMethodId)}
          >
            <View
              accessible={true}
              className="flex flex-row items-center justify-between bg-[#F3F6F6] p-4 my-2"
            >
              <View className="flex flex-row items-center">
                <View className="mr-3">
                  {value.brand === "visa" ? (
                    <Visa />
                  ) : value.brand === "mastercard" ? (
                    <MasterCard />
                  ) : null}
                </View>
                <View className="flex gap-2">
                  <View className="flex flex-row items-center gap-2">
                    <Text className="font-semibold text-sm">
                      {value.brand.toLocaleUpperCase()}
                    </Text>
                    {value.isPrimary ? (
                      <Text className="bg-primary text-white px-2 py-[2px] text-sm rounded-full">
                        {t("Primary")}
                      </Text>
                    ) : null}
                  </View>
                  <Text className="text-[12px]">
                    **** **** **** {value.last4}
                  </Text>
                  <Text className="text-[12px]">
                    {value.exp_month} / {value.exp_year}
                  </Text>
                </View>
              </View>
              {/* <ForwadArrow /> */}
              <Popover
                isVisible={openPopoverId === value.paymentMethodId}
                onRequestClose={() => setOpenPopoverId(null)}
                from={(sourceRef, showPopover) => (
                  <TouchableOpacity
                    onPress={() => setOpenPopoverId(value.paymentMethodId)}
                  >
                    <ThreeDots width={18} height={18} />
                  </TouchableOpacity>
                )}
                animationConfig={{ duration: 150, delay: 0 }}
                popoverStyle={{ padding: 8 }}
              >
                <Pressable
                  className="active:bg-slate-100 rounded-sm"
                  disabled={value.isPrimary}
                  onPress={() =>
                    handleMakePrimary(value.customerID, value.paymentMethodId)
                  }
                >
                  <Text className="text-center text-sm w-full px-2 py-1">
                    {t("Make Primary")}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    handleDeleteCards(value.customerID, value.paymentMethodId)
                  }
                  className="mt-2 active:bg-slate-100 rounded-sm"
                >
                  <Text className="text-center text-sm w-full px-2 py-1">
                    {t("Remove")}
                  </Text>
                </Pressable>
              </Popover>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <Pressable onPress={handlePay}>
        <View className="bg-primary mt-2 rounded-md py-2">
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-center">{t("PAY")}</Text>
          )}
        </View>
      </Pressable>
    </>
  );
};

export default DepositCardList;
