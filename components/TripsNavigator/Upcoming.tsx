import { View, Text, ScrollView } from "react-native";
import React from "react";
import { TripComProp } from "@/types";
import Spinner from "../Spinner";
import Error from "../Error";
import { useRouter } from "expo-router";
import PropertyCard from "./PropertyCard";

const Upcoming = ({ data, error, isError, isPending }: TripComProp) => {
  return (
    <>
      {isPending ? (
        <View className="flex-1 bg-white items-center justify-center">
          <Spinner />
        </View>
      ) : isError ? (
        <View className="flex-1 bg-white items-center justify-center">
          <Error error={error} />
        </View>
      ) : (
        <View className="flex-1 bg-white pt-6 px-2">
          <ScrollView>
            {data && data.length > 0 ? (
              data.map((value, index) => (
                <PropertyCard data={value} key={index} />
              ))
            ) : (
              <View className="h-[80vh] flex items-center justify-center">
                <Text className="font-bold text-center">No Record</Text>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </>
  );
};

export default Upcoming;
