import React from "react";
import ThreeDDetailsComp from "@/components/ThreeDDetails";
import { useLocalSearchParams } from "expo-router";

const ThreeDDetails = () => {
  const { id } = useLocalSearchParams();
  return <ThreeDDetailsComp id={id} />;
};

export default ThreeDDetails;
