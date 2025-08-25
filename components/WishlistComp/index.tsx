import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, memo } from "react";
import BackArrow from "../../assets/backArrow.svg";
import SearchIcon from "../../assets/Search.svg";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchwishlist } from "./request";
import BookingCarousel from "../BookingCarousel";
import { ScrollView } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const WishlistComp = memo(() => {
  const router = useRouter();
  const { t } = useTranslation()
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["wishlist-properties"],
    queryFn: fetchwishlist,
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0582CA" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="w-[90%] mx-auto mt-6">
        <View className="flex flex-row items-center gap-3">
          <Pressable onPress={() => router.push("/(tabs)")}>
            <BackArrow />
          </Pressable>

          <View className="flex-1 flex flex-row items-center justify-between border border-[#DEDEDE] h-12 bg-[#FCFCFC] px-4 rounded-full">
            <TextInput
              className="text=[#717171]"
              placeholder={t("SearchDestinations")}
            />
            <SearchIcon width={18} height={18} color={"#111"} />
          </View>
        </View>
        <View className="flex items-center justify-center gap-2 pb-[11.6rem]">
          <ScrollView showsVerticalScrollIndicator={false}>
            {data && data.length > 0 ? (
              data.map((value, index) => (
                <BookingCarousel
                  key={index}
                  rent={value.rent}
                  data={value.files}
                  title={value.title}
                  propertyId={value._id}
                  likedBy={value.likedBy}
                  avgRating={value.avgRating}
                  totalReviews={value.totalreviews}
                />
              ))
            ) : (
              <View className="h-[90vh] flex items-center justify-center">
                <Text className="text-center font-bold">No Wishlists</Text>
              </View>
            )}
          </ScrollView>
          {isError ? (
            <Text className="text-red-500">{error?.message}</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
});

export default WishlistComp;
