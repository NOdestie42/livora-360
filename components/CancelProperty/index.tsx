import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { View, Text, Pressable } from "react-native";
import { CancelBooking, CancelBookingWithUpdation } from "./request";
import Spinner from "../Spinner";
import Error from "../Error";
import { CancelBookingPropsTypes } from "@/types";
import Toast from "react-native-toast-message";

const CancelPropertyComp = ({ id }: { id: string | string[] }) => {
  const [PropertyStatus, setPropertyStatus] = useState<string>("");
  const [TimePeriod, setTimePeriod] = useState<number>(0);
  const router = useRouter();

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["cancel-booking-property"],
    queryFn: () => CancelBooking(id),
  });

  useEffect(() => {
    const calculateTimePeriod = (inputDate: Date | undefined) => {
      const currentTime = new Date();

      if (
        !inputDate ||
        !(inputDate instanceof Date) ||
        isNaN(inputDate.getTime())
      ) {
        console.warn("Input date is undefined or not a valid Date");
        return;
      }
      if (currentTime > inputDate) {
        setTimePeriod(0);
      }

      const timeDifference = inputDate.getTime() - currentTime.getTime();
      const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
      console.log({ hoursDifference });

      if (hoursDifference >= 48) {
        setTimePeriod(48);
        setPropertyStatus("fullrefund");
      } else if (hoursDifference >= 24) {
        setTimePeriod(24);
        setPropertyStatus("partialrefund");
      } else {
        setTimePeriod(hoursDifference);
        setPropertyStatus("norefund");
      }
    };
    const dateString = data?.startDate;

    if (dateString) {
      const startDate = new Date(dateString);
      console.log("Calculated Time Period:", calculateTimePeriod(startDate));
    } else {
      console.warn("Start date is undefined");
    }
  }, [data]);

  const mutation = useMutation<void, Error, CancelBookingPropsTypes>({
    mutationFn: CancelBookingWithUpdation,
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Property Cancelled",
      });
      router.back();
    },
    onError: (error: Error) => {
      console.error("Add location error:", error);
    },
  });

  const handleConfirm = () => {
    const newMessage: CancelBookingPropsTypes = {
      status: PropertyStatus,
      bookingId: id,
    };
    mutation.mutate(newMessage);
  };

  if (isPending) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Spinner />
      </View>
    );
  }

  if (isError) {
    return <Error error={error} />;
  }

  return (
    <View className="flex-1 bg-white ">
      <View className="w-[90%] mx-auto mt-6">
        <Text className="text-center text-xl font-semibold">
          Cancelation Policy
        </Text>
        <View className="flex gap-2 pt-4">
          <Text className="font-bold text-sm">
            Full Refund for Cancellation within 48 Hours of Booking:
          </Text>
          <Text className="text-secondary text-sm">
            If the user cancels a booking within 48 hours after making the
            booking, they will receive a full refund, regardless of the
            scheduled event time.
          </Text>
          <Text className="font-bold text-sm">
            Half Refund after 48 Hours of Booking:{" "}
          </Text>
          <Text className="text-secondary text-sm">
            If the user cancels the booking after 48 hours from the time of
            making the booking, they will receive half refund, regardless of how
            far in the future the event is scheduled.
          </Text>
          <Text className="font-bold text-sm">Booking Confirmation: </Text>
          <Text className="text-secondary text-sm">
            Once the user confirms the booking, the cancellation policy will
            apply based on the time elapsed since the booking was made, not the
            scheduled event time.
          </Text>
          <Text className="font-bold text-sm">Cancellation Process:</Text>
          <Text className="text-secondary text-sm">
            The user can initiate the cancellation process, and the system will
            check if the cancellation is within 48 hours from the booking time
            to determine refund eligibility.
          </Text>
          {TimePeriod === 48 ? (
            <Text>
              The time period left is greater than 48 you will get the full fund
            </Text>
          ) : TimePeriod === 24 ? (
            <Text>
              The time period left is less than 48 but greater than 24 you will
              get the half fund
            </Text>
          ) : (
            <Text>
              The time period left is less than 24 you will not get any funded
            </Text>
          )}
        </View>
        <View className="flex flex-row items-center justify-end mt-4 gap-2">
          <Pressable onPress={() => handleConfirm()}>
            <View className="bg-primary py-3 px-6 rounded-xl">
              <Text className="text-white font-bold">Confirm</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => router.back()}>
            <View className="bg-secondary py-3 px-6 rounded-xl">
              <Text className="text-gray-700 font-bold">Back</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default CancelPropertyComp;
