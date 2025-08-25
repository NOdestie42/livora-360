import { View, Text, Image } from "react-native";
import React from "react";
import { TripComProp } from "@/types";
import Spinner from "../Spinner";
import Error from "../Error";
import { ImageBackground } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";

const Past = ({ data, error, isError, isPending }: TripComProp) => {
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
                <View key={index} className="w-full rounded-md mb-4">
                  <ImageBackground
                    source={{ uri: value.property.files[0] }}
                    className="h-[200px]"
                    style={{
                      width: "100%",
                      alignItems: "center",
                      overflow: "hidden",
                      borderRadius: 6,
                    }}
                    key={index}
                  />
                  <View className="px-2 pt-2 border-b border-secondary pb-2">
                    <Text className="font-bold">{value.property.title}</Text>
                    <Text className="text-sm">
                      Room is rental unit hosted by {value.hostedBy.firstName}
                    </Text>
                  </View>
                  <View className="py-2 flex flex-row items-center px-2">
                    <View className="border-r border-secondary pr-3">
                      <Text className="text-sm">
                        {moment.utc(value.startDate).date()}{" "}
                        {moment.utc(value.startDate).format("MMMM")}{" "}
                        {moment.utc(value.startDate).year()}
                      </Text>
                      <Text className="text-sm">
                        {moment.utc(value.endDate).date()}{" "}
                        {moment.utc(value.endDate).format("MMMM")}{" "}
                        {moment.utc(value.endDate).year()}
                      </Text>
                    </View>
                    <Text className="font-semibold px-2">HamBurg</Text>
                  </View>
                </View>
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

export default Past;
