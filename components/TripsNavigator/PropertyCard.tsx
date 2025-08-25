import { View, Text, ImageBackground } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, RelativePathString } from "expo-router";
import moment from "moment";
import { TripListpropstypes } from "@/types";
import getCityName from "@/utils/getLocationViaLatLng";

const PropertyCard = ({ data }: { data: TripListpropstypes }) => {
  const [cityName, setCityName] = useState<string>("");

  useEffect(() => {
    const fetchCityName = async () => {
      if (data && data.property.location && data.property.location.lng) {
        const city = await getCityName(
          data.property.location.lat,
          data.property.location.lng
        );

        if (city) {
          setCityName(city);
        }
      }
    };

    fetchCityName();
  }, [data]);

  return (
    <View className="w-full rounded-md mb-4">
      <ImageBackground
        source={{ uri: data.property.files[0] }}
        className="h-[200px]"
        style={{
          width: "100%",
          alignItems: "center",
          overflow: "hidden",
          borderRadius: 6,
        }}
      />
      <View className="flex flex-row items-center justify-between border-b border-secondary pb-2">
        <View className="px-2 pt-2">
          <Text className="font-bold">{data.property.title}</Text>
          <Text className="text-sm">
            Room is rental unit hosted by {data.hostedBy.firstName}
          </Text>
        </View>
        {/* <Popover
          from={(ref, show) => (
            <TouchableOpacity onPress={show}>
              <ThreeDots width={18} height={18} />
            </TouchableOpacity>
          )}
        >
          <Pressable onPress={() => router.push("/cancelproperty")}></Pressable>
        </Popover> */}
        {data.status === "Pending" && (
          <Link href={("cancelproperty/" + data._id) as RelativePathString}>
            <Text className="font-semibold text-center text-sm px-2 py-2">
              Cancel
            </Text>
          </Link>
        )}
      </View>
      <View className="py-2 flex flex-row items-center px-2">
        <View className="border-r border-secondary pr-3">
          <Text className="text-sm">
            {moment.utc(data.startDate).date()}{" "}
            {moment.utc(data.startDate).format("MMMM")}{" "}
            {moment.utc(data.startDate).year()}
          </Text>
          <Text className="text-sm">
            {moment.utc(data.endDate).date()}{" "}
            {moment.utc(data.endDate).format("MMMM")}{" "}
            {moment.utc(data.endDate).year()}
          </Text>
        </View>
        <Text className="font-semibold px-2">{cityName}</Text>
      </View>
    </View>
  );
};

export default PropertyCard;
