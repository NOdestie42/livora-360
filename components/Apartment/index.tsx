import { ScrollView, View } from "react-native";
import React from "react";
import { TopNavigationProps } from "@/types";
import BookingCarousel from "../BookingCarousel";

const Apartment = ({ data }: TopNavigationProps) => {
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

export default Apartment;
