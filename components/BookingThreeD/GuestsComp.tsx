import React from "react";
import Plus from "../../assets/plus.svg";
import Minus from "../../assets/minus.svg";
import { View, Text, Pressable } from "react-native";
import { LocationData } from "@/types";

type Guests3dCompProps = {
  guestsDetails: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
    totalGuests: number;
  };
  setGuestsDetails: (details: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
    totalGuests: number;
  }) => void;
  data: LocationData | undefined;
};

const Guests3dComp = ({
  guestsDetails,
  setGuestsDetails,
  data,
}: Guests3dCompProps) => {
  return (
    <View>
      <Text className="text-center font-semibold">Guests</Text>
      <Text className="text-sm">
        This place has a maximum of {data?.maxpersons} guests.
      </Text>
      <View className="flex flex-row items-center justify-between mt-2">
        <View>
          <Text className="font-bold">Adults</Text>
          <Text className="text-xs">Age 13+</Text>
        </View>
        <View className="flex flex-row items-center gap-2">
          {guestsDetails.adults > 0 && (
            <Pressable
              onPress={() =>
                setGuestsDetails({
                  ...guestsDetails,
                  adults: guestsDetails.adults - 1,
                  totalGuests: guestsDetails.totalGuests - 1,
                })
              }
            >
              <Minus width={18} height={18} />
            </Pressable>
          )}
          <Text>{guestsDetails.adults}</Text>
          {guestsDetails.totalGuests < data?.maxpersons! && (
            <Pressable
              onPress={() =>
                setGuestsDetails({
                  ...guestsDetails,
                  adults: guestsDetails.adults + 1,
                  totalGuests: guestsDetails.totalGuests + 1,
                })
              }
            >
              <Plus width={18} height={18} />
            </Pressable>
          )}
        </View>
      </View>
      <View className="flex flex-row items-center justify-between mt-2">
        <View>
          <Text className="font-bold">Children</Text>
          <Text className="text-xs">Age 2-12</Text>
        </View>
        <View className="flex flex-row items-center gap-2">
          {guestsDetails.children > 0 && (
            <Pressable
              onPress={() =>
                setGuestsDetails({
                  ...guestsDetails,
                  children: guestsDetails.children - 1,
                  totalGuests: guestsDetails.totalGuests - 1,
                })
              }
            >
              <Minus width={18} height={18} />
            </Pressable>
          )}
          <Text>{guestsDetails.children}</Text>

          {guestsDetails.totalGuests < data?.maxpersons! && (
            <Pressable
              onPress={() =>
                setGuestsDetails({
                  ...guestsDetails,
                  children: guestsDetails.children + 1,
                  totalGuests: guestsDetails.totalGuests + 1,
                })
              }
            >
              <Plus width={18} height={18} />
            </Pressable>
          )}
        </View>
      </View>
      <View className="flex flex-row items-center justify-between mt-2">
        <View>
          <Text className="font-bold">Infants</Text>
          <Text className="text-xs">Under 2</Text>
        </View>
        <View className="flex flex-row items-center gap-2">
          {guestsDetails.infants > 0 && (
            <Pressable
              onPress={() =>
                setGuestsDetails({
                  ...guestsDetails,
                  infants: guestsDetails.infants - 1,
                  totalGuests: guestsDetails.totalGuests - 1,
                })
              }
            >
              <Minus width={18} height={18} />
            </Pressable>
          )}
          <Text>{guestsDetails.infants}</Text>
          {guestsDetails.totalGuests < data?.maxpersons! && (
            <Pressable
              onPress={() =>
                setGuestsDetails({
                  ...guestsDetails,
                  infants: guestsDetails.infants + 1,
                  totalGuests: guestsDetails.totalGuests + 1,
                })
              }
            >
              <Plus width={18} height={18} />
            </Pressable>
          )}
        </View>
      </View>
      <View className="flex flex-row items-center justify-between mt-2">
        <View>
          <Text className="font-bold">Pets</Text>
        </View>
        <View className="flex flex-row items-center gap-2">
          {guestsDetails.pets > 0 && (
            <Pressable
              onPress={() =>
                setGuestsDetails({
                  ...guestsDetails,
                  pets: guestsDetails.pets - 1,
                  totalGuests: guestsDetails.totalGuests - 1,
                })
              }
            >
              <Minus width={18} height={18} />
            </Pressable>
          )}
          <Text>{guestsDetails.pets}</Text>
          {guestsDetails.totalGuests < data?.maxpersons! && (
            <Pressable
              onPress={() =>
                setGuestsDetails({
                  ...guestsDetails,
                  pets: guestsDetails.pets + 1,
                  totalGuests: guestsDetails.totalGuests + 1,
                })
              }
            >
              <Plus width={18} height={18} />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

export default Guests3dComp;
