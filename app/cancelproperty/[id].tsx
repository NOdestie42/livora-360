import React from "react";
import CancelPropertyComp from "@/components/CancelProperty";
import { useLocalSearchParams } from "expo-router";

const CancelProperty = () => {
  const { id } = useLocalSearchParams();
  return <CancelPropertyComp id={id} />;
};

export default CancelProperty;
