import { View, Text, Pressable } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import BackArrow from "../../assets/backArrow.svg";
import { useRouter } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Guests3dComp from "./GuestsComp";
import { useQuery } from "@tanstack/react-query";
import { BookingPropertyFunction } from "./request";
import Date3dPicker from "./Date3dPicker";
import { Moment } from "moment";
import Spinner from "../Spinner";
import Error from "../Error";
const initialGuestsDetails = {
  adults: 0,
  children: 0,
  infants: 0,
  pets: 0,
  totalGuests: 0,
};

const BookingThreeDComp = ({ bookingId }: { bookingId: string | string[] }) => {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [guestsDetails, setGuestsDetails] = useState(initialGuestsDetails);
  const [startDate, setStartDate] = useState<Moment | null>(null);
  const [endDate, setEndDate] = useState<Moment | null>(null);

  const [bottomSheetContent, setBottomSheetContent] = useState<
    "date" | "guests" | null
  >(null);

  useEffect(() => {
    setBottomSheetContent("guests");
  }, []);

  const openBottomSheet = (type: "date" | "guests") => {
    setBottomSheetContent(type);
    bottomSheetRef.current?.expand();
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["booking-property-data"],
    queryFn: () => BookingPropertyFunction(bookingId),
  });

  const handleDatesChange = (start: Moment | null, end: Moment | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const formatDate = (date: Moment | null) =>
    date ? date.format("DD-MM-YYYY") : "";

  const updatedstartDate = formatDate(startDate);
  const updatedendDate = formatDate(endDate);

  if (isPending) return <Spinner />;
  if (isError) return <Error error={error} />;

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-white w-full px-[5%] mx-auto">
        <View className="flex flex-row items-center justify-between mt-8">
          <Pressable onPress={() => router.back()}>
            <View>
              <BackArrow />
            </View>
          </Pressable>
          <Text className="text-lg font-semibold">Booking Details</Text>
          <View />
        </View>

        <View className="mt-3 space-y-4">
          <View>
            <Text className="text-sm font-semibold">Dates</Text>
            <Pressable onPress={() => openBottomSheet("date")}>
              <View className="py-2 border-b border-secondary my-2">
                <Text className="text-sm">
                  {updatedstartDate && updatedendDate
                    ? `${updatedstartDate} to ${updatedendDate}`
                    : "Enter the date"}
                </Text>
              </View>
            </Pressable>
          </View>

          <View>
            <Text className="text-sm font-semibold">Guests</Text>
            <Pressable onPress={() => openBottomSheet("guests")}>
              <View className="py-2 border-b border-secondary my-2 ">
                <Text className="text-sm">
                  {guestsDetails.totalGuests === 0
                    ? "Enter the list"
                    : [
                      guestsDetails.adults > 0 &&
                      `${guestsDetails.adults} Adults`,
                      guestsDetails.children > 0 &&
                      `${guestsDetails.children} Children`,
                      guestsDetails.infants > 0 &&
                      `${guestsDetails.infants} Infants`,
                      guestsDetails.pets > 0 && `${guestsDetails.pets} Pets`,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* <CustomButton text="Reserve" /> */}
        {guestsDetails.totalGuests > 0 && startDate && endDate ? (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/3d-details/booking/finalstepbooking",
                params: {
                  bookingId,
                  updatedstartDate,
                  updatedendDate,
                  startDate: startDate ? startDate.toISOString() : null,
                  endDate: endDate ? endDate.toISOString() : null,
                  data: JSON.stringify(data),
                  adults: guestsDetails.adults,
                  children: guestsDetails.children,
                  infants: guestsDetails.infants,
                  pets: guestsDetails.pets,
                  totalGuests: guestsDetails.totalGuests,
                },
              })
            }
          >
            <View className="bg-primary py-2 mt-4">
              <Text className="text-white text-center">Reserve</Text>
            </View>
          </Pressable>
        ) : (
          <View className="bg-secondary py-2 mt-4">
            <Text className="text-white text-center">Reserve</Text>
          </View>
        )}

        {/* Bottom Sheet */}
        <BottomSheet
          ref={bottomSheetRef}
          enablePanDownToClose={true}
          snapPoints={["30%", "50%"]}
        >
          <BottomSheetView className="p-4">
            {bottomSheetContent === "date" ? (
              <Date3dPicker
                propertyId={bookingId}
                startDate={startDate}
                endDate={endDate}
                onDatesChange={handleDatesChange}
              />
            ) : bottomSheetContent === "guests" ? (
              <Guests3dComp
                data={data}
                guestsDetails={guestsDetails}
                setGuestsDetails={setGuestsDetails}
              />
            ) : null}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

export default BookingThreeDComp;
