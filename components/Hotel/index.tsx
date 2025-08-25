import { ScrollView, View } from "react-native";
import React from "react";
import BookingCarousel from "../BookingCarousel";
import { TopNavigationProps } from "@/types";

const Hotel = ({ data }: TopNavigationProps) => {
  return (
    <View className={"flex-1 bg-white"}>
      <ScrollView
        className="w-[90%] mx-auto"
        showsVerticalScrollIndicator={false}
      >
        {data
          ? data.map((value, index) => (
              <BookingCarousel
                key={index}
                data={value.files}
                title={value.title}
                rent={value.rent}
                propertyId={value._id}
                likedBy={value.likedBy}
                totalReviews={value.totalreviews}
                avgRating={value.avgRating}
              />
            ))
          : null}
      </ScrollView>
    </View>
  );
};

export default Hotel;
