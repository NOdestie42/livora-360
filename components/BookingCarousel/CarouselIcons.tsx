import { View, Text } from "react-native";
import React from "react";
import PetFoot from "../../assets/PetFoot.svg";
import SwigleLines from "../../assets/Swigle.svg";
import TableChair from "../../assets/TableChair.svg";
import Trees from "../../assets/Trees.svg";
import ThreeDots from "../../assets/ThreeDots.svg";

const CarouselIcons = ({ size }: { size: number }) => {
  return (
    <View className="flex flex-row items-center gap-3">
      <PetFoot width={size} height={size} />
      <SwigleLines width={size} height={size} />
      <TableChair width={size} height={size} />
      <Trees width={size} height={size} />
      <ThreeDots width={size} height={size} />
    </View>
  );
};

export default CarouselIcons;
