import React, { useState } from "react";
import { useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";
import BackArrow from "../../assets/backArrow.svg";
import { TestimonialItem, testimonials } from "./TestimonialItem";

const FAQsComp: React.FC = () => {
  const router = useRouter();
  const [openTestimonial, setOpenTestimonial] = useState<number | null>(null);

  return (
    <View className="flex-1 bg-white">
      <View className="w-[90%] mx-auto mt-6">
        <Pressable onPress={() => router.back()}>
          <BackArrow />
        </Pressable>
        <Text className="text-[28px] font-semibold py-4">FAQs</Text>
        <View className="flex flex-col p-2 bg-[#F9F9F9] rounded-md">
          {testimonials.map((item) => (
            <TestimonialItem
              key={item.id}
              item={item}
              isOpen={openTestimonial === item.id}
              onPress={() =>
                setOpenTestimonial(openTestimonial === item.id ? null : item.id)
              }
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default FAQsComp;
