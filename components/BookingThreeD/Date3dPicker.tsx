import { View, Text, Pressable, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import moment, { Moment } from "moment";
import { useQuery } from "@tanstack/react-query";
import { checkingpropertiesdates } from "./request";
import { ReservedPropertiesDate } from "@/types";
import Toast from "react-native-toast-message";
import ForwardArror from "../../assets/forwardArrow.svg";

type Date3dPickerProps = {
  propertyId: string | string[];
  startDate: Moment | null;
  endDate: Moment | null;
  onDatesChange: (startDate: Moment | null, endDate: Moment | null) => void;
};

const Date3dPicker = ({
  endDate,
  onDatesChange,
  propertyId,
  startDate,
}: Date3dPickerProps) => {
  const [viewDate, setViewDate] = useState(moment());
  const [selecting, setSelecting] = useState(false); 

  const startOfMonth = viewDate.clone().startOf("month");
  const endOfMonth = viewDate.clone().endOf("month");
  const days = Array.from({ length: endOfMonth.date() }, (_, i) =>
    startOfMonth.clone().add(i, "days")
  );

  const {
    isPending: reserveDatePending,
    isError: reserveDateisError,
    data: reserveDateData = [],
    error: reserveDateError,
  } = useQuery({
    queryKey: ["checking-properties-dates", propertyId],
    queryFn: () => checkingpropertiesdates(propertyId),
    staleTime: 0,           
    refetchOnMount: "always",  
  });

  const normalizeDate = (date: string | Date) => moment(date).startOf("day");

  const isReservedDate = (day: Moment) => {
    return reserveDateData.some((range: ReservedPropertiesDate) => {
      const reservedStart = normalizeDate(range.startDate);
      const reservedEnd = moment(range.endDate).endOf("day");
      return day.isBetween(reservedStart, reservedEnd, "day", "[]");
    });
  };

  const isRangeValid = (start: Moment, end: Moment) => {
    const rangeStart = start.clone().startOf("day");
    const rangeEnd = end.clone().endOf("day");
    return !reserveDateData.some((reservedRange: ReservedPropertiesDate) => {
      const reservedStart = normalizeDate(reservedRange.startDate);
      const reservedEnd = moment(reservedRange.endDate).endOf("day");
      return (
        rangeStart.isSameOrBefore(reservedEnd) &&
        rangeEnd.isSameOrAfter(reservedStart)
      );
    });
  };

  const handleDayClick = (day: Moment) => {
    const today = moment().startOf("day");
    if (day.isBefore(today) || isReservedDate(day)) {
      return;
    }

    setSelecting(true); 

    setTimeout(() => {
      if (!startDate || (startDate && endDate)) {
        onDatesChange(day.clone(), null);
      } else if (startDate && !endDate) {
        if (day.isAfter(startDate) && isRangeValid(startDate, day)) {
          onDatesChange(startDate.clone(), day.clone());
        } else {
          Toast.show({
            type: "error",
            text1:
              "Selected range includes reserved dates. Please select a different range.",
          });
          onDatesChange(null, null);
        }
      }

      setSelecting(false); 
    }, 0); 
  };

  const renderDay = (day: Moment) => {
    const isSelectedStart = startDate && day.isSame(startDate, "day");
    const isSelectedEnd = endDate && day.isSame(endDate, "day");
    const isInRange =
      startDate && endDate && day.isBetween(startDate, endDate, "day", "[]");
    const isPast = day.isBefore(moment().startOf("day"));
    const isReserved = isReservedDate(day);

    return (
      <Pressable
        key={day.toString()}
        onPress={() => handleDayClick(day)}
        className={`w-12 h-12 items-center justify-center rounded-full
          ${isSelectedStart || isSelectedEnd ? "bg-orange-500" : ""}
          ${isInRange ? "bg-gray-200" : ""}
          ${isPast || isReserved ? "bg-gray-100" : ""}`}
        disabled={isPast || isReserved}
      >
        <Text
          className={`${
            isSelectedStart || isSelectedEnd ? "text-white" : "text-black"
          } ${isPast || isReserved ? "text-gray-400" : ""}`}
        >
          {day.date()}
        </Text>
      </Pressable>
    );
  };

  const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <View>
      {/* Month navigation */}
      <View className="flex flex-row items-center justify-between">
        <Pressable
          onPress={() => setViewDate(viewDate.clone().subtract(1, "M"))}
        >
          <View
            style={{ transform: [{ rotate: "180deg" }] }}
            className="m-2 p-2"
          >
            <ForwardArror width={15} height={15} />
          </View>
        </Pressable>
        <Text className="text-base font-bold text-center">
          {viewDate.format("MMMM YYYY")}
        </Text>
        <Pressable onPress={() => setViewDate(viewDate.clone().add(1, "M"))}>
          <View className="m-2 p-2">
            <ForwardArror width={15} height={15} />
          </View>
        </Pressable>
      </View>

      <View className="flex flex-row flex-wrap items-center justify-center gap-2">
        {DAYS_OF_WEEK.map((day) => (
          <View key={day} className="w-12 h-8 items-center justify-center ">
            <Text className="text-sm font-normal text-[#333333]">{day}</Text>
          </View>
        ))}
      </View>

      <View className="flex flex-row flex-wrap items-center justify-center gap-2 relative">
        {reserveDatePending && <Text>Loading...</Text>}
        {reserveDateisError && (
          <Text className="text-red-500">
            Error: {String(reserveDateError)}
          </Text>
        )}
        {!reserveDatePending && !reserveDateisError && days.map(renderDay)}

        {selecting && (
          <View className="absolute inset-0 bg-white/70 items-center justify-center rounded-lg">
            <ActivityIndicator size="large" color="#ff6600" />
            <Text className="mt-2 text-gray-700">Updating selection...</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default Date3dPicker;
