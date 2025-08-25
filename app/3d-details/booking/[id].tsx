import React from "react";
import BookingThreeDComp from "@/components/BookingThreeD";
import { useLocalSearchParams } from "expo-router";

const Booking = () => {
  const { id } = useLocalSearchParams();
  return <BookingThreeDComp bookingId={id} />;
};

export default Booking;
