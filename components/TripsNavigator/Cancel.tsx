import React from "react";
import moment from "moment";
import Error from "../Error";
import Spinner from "../Spinner";
import { TripComProp } from "@/types";
import { View, Text, ImageBackground, ScrollView } from "react-native";
import PropertyCard from "./PropertyCard";

const Cancel = ({ data, error, isError, isPending }: TripComProp) => {
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

export default Cancel;
