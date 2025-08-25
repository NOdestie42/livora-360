import React, { useEffect, useState } from "react";
import { View, Text, Pressable, Image, Button, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import BackArrow from "../../../assets/backArrow.svg";
import RatingStar from "../../../assets/yellowStar.svg";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomButton from "@/components/CustomButton";
import { BookingData } from "./request";
import Toast from "react-native-toast-message";
import { BookingSchemaPropsTypes } from "@/types";
import { getItemFromAsyncStorage } from "@/AsyncStorage";
import { DepositCardlistFucntion } from "@/components/Deposit/request";

const FinalStepBooking = () => {
  const router = useRouter();
  const [nights, setNights] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null)
  const [primaryCard, setPrimaryCard] = useState('');
  const queryCLient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const {
    bookingId,
    updatedstartDate,
    updatedendDate,
    endDate,
    startDate,
    data,
    adults,
    children,
    infants,
    pets,
    totalGuests,
  } = useLocalSearchParams();

  const { isPending, isError, data: CardData, error } = useQuery({
    queryKey: ["Deposite-cards-list"],
    queryFn: DepositCardlistFucntion,
  });

  useEffect(() => {
    if (CardData?.paymentMethods) {
      const primary = CardData.paymentMethods.find((card) => card.isPrimary);
      if (primary) {
        setPrimaryCard(primary.paymentMethodId);
      }
    }
  }, [CardData, data]);

  const parseData = data && typeof data === "string" ? JSON.parse(data) : null;


  function calculateNights(
    startDate: string | string[],
    endDate: string | string[]
  ) {
    const start = moment(startDate, "DD-MM-YYYY");
    const end = moment(endDate, "DD-MM-YYYY");
    const nightsDiff = end.diff(start, "days");
    return nightsDiff;
  }

  useEffect(() => {
    const getUserId = async () => {
      const userId = await getItemFromAsyncStorage('userId')
      setUserId(userId);
    }
    getUserId()
  }, []);

  useEffect(() => {
    const nightsDiff = calculateNights(updatedstartDate, updatedendDate);
    setNights(nightsDiff);
  }, [updatedstartDate, updatedendDate]);

  const bookingmutation = useMutation({
    mutationFn: BookingData,
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: async (data) => {
      queryCLient.setQueryData(["bookingdata"], data);
      Toast.show({
        type: "success",
        text1: "Booking Successfull",
        text2: 'Press to check your trip',
        onPress: () => {
          router.push('/trips')
        },
      });
      setLoading(false);
    },
    onError: (error: Error) => {
      console.log("Login error:", error);
      const errorMessage =
        (error as any)?.response?.data?.message || "An error occurred";
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
      });
    },
  });


  const handlePay = () => {
    const sendingData: BookingSchemaPropsTypes = {
      price: parseData.rent * nights + 20,
      stayInNights: nights,
      pets: Number(pets),
      adults: Number(adults),
      children: Number(children),
      infants: Number(infants),
      totalPersons: parseData.maxpersons,
      hostedBy: parseData?.createdBy._id,
      bookedBy: userId,
      startDate: updatedstartDate ? new Date(updatedstartDate as string) : new Date(startDate as string),
      endDate: updatedendDate ? new Date(updatedendDate as string) : new Date(endDate as string),
      property: parseData._id,
      wallet_id: primaryCard,
      status: "Pending"
    };
    bookingmutation.mutate(sendingData);
  }

  return (
    <View className="flex-1 bg-white w-full px-[5%] mx-auto">
      <View className="flex flex-row items-center justify-between mt-8">
        <Pressable onPress={() => router.back()}>
          <View>
            <BackArrow />
          </View>
        </Pressable>
        <Text className="text-lg font-semibold">Request to Book</Text>
        <View />
      </View>
      <View className="py-6 flex flex-row items-start gap-6 border-b border-[#EFEFEF]">
        <Image
          source={{ uri: parseData.files[0] }}
          className="w-32 h-32 rounded-md"
        />
        <View>
          <Text className="text-sm">Location</Text>
          <Text className="text-lg font-semibold">{parseData.title}</Text>
          <View className="flex flex-row items-center gap-1">
            <RatingStar />
            <Text className="text-base font-bold text-[#FFD016]">4.3</Text>
            <Text className="text-sm text-[#555555]">(4.1)</Text>
          </View>
        </View>
      </View>
      <View className="py-4 border-b border-[#EFEFEF]">
        <Text className="text-[#2B2B2B] text-xl font-semibold pb-4">
          Your Trip
        </Text>
        <Text className="text-[#2B2B2B] text-[18px] font-bold">Dates</Text>
        <View className="pt-1 pb-4">
          <Text className="text-sm">
            {updatedstartDate && updatedendDate
              ? `${updatedstartDate} to ${updatedendDate}`
              : null}
          </Text>
        </View>
        <Text className="text-[#2B2B2B] text-[18px] font-bold">Guests</Text>
        <View className="pt-1 pb-4">
          <Text className="text-sm">
            {[
              Number(adults) > 0 && `${adults} Adults`,
              Number(children) > 0 && `${children} Children`,
              Number(infants) > 0 && `${infants} Infants`,
              Number(pets) > 0 && `${pets} Pets`,
            ]
              .filter(Boolean)
              .join(", ")}
          </Text>
        </View>
      </View>
      <View className="py-4 border-b border-[#EFEFEF]">
        <Text className="text-[#2B2B2B] text-[18px] font-bold">
          Price Details
        </Text>
        <View className="flex flex-col gap-2 pt-2">
          <View className="flex flex-row items-center justify-between">
            <Text className="text-sm text-[#646464]">
              ${parseData.rent} x {nights} {nights === 1 ? `night` : `nights`}
            </Text>
            <Text className="text-sm text-[#646464]">
              ${parseData.rent * nights}
            </Text>
          </View>
          <View className="flex flex-row items-center justify-between">
            <Text className="text-sm text-[#646464]">Viste Visit Fee </Text>
            <Text className="text-sm text-[#646464]">$20</Text>
          </View>

          <View className="flex flex-row items-center justify-between mt-2">
            <Text className="text-sm text-[#2B2B2B] font-semibold">
              Total (USD)
            </Text>
            <Text className="text-sm text-[#2B2B2B] font-semibold">
              ${parseData.rent * nights + 20}
            </Text>
          </View>
        </View>
      </View>
      <View className="mt-2">
        <Text className="text-[#2B2B2B] text-xl font-semibold pb-4">
          Payment Method
        </Text>
        <View className="flex flex-row items-center gap-2">
          <MaterialCommunityIcons name="wallet" size={24} color="black" />
          <View>
            <Text className="text-base font-bold">Wallet</Text>
            <Text className="text-xs">Balance: 12131</Text>
          </View>
        </View>
      </View>
      <View className="flex gap-2 mt-6">
        <CustomButton onPress={() => router.push("/wallet")} text="Go to Wallet" />
        <CustomButton text="Add Cards" />
        <CustomButton disable={!primaryCard} onPress={handlePay} text={loading ? <ActivityIndicator size="small" color="#fff" /> : "Pay"} />
      </View>
    </View>
  );
};

export default FinalStepBooking;
