import React, { useState, useRef, useEffect } from "react";
import { View, Text, Pressable, Animated } from "react-native";
import ChevronUpIcon from "../../assets/arrowup.svg";
import ChevronDownIcon from "../../assets/arrowdown.svg";
interface Testimonial {
  id: number;
  name: string;
  text: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Lorem Ipsum is simply dummy?",
    text: "This is the best service I've ever used!",
  },
  {
    id: 2,
    name: "Jane Smith",
    text: "Absolutely amazing experience! Absolutely amazing experience! Absolutely amazing experience! Absolutely amazing experience! Absolutely amazing experience!",
  },
  { id: 3, name: "Alex Johnson", text: "Would recommend to everyone!" },
];

interface TestimonialItemProps {
  item: Testimonial;
  isOpen: boolean;
  onPress: () => void;
}

export const TestimonialItem: React.FC<TestimonialItemProps> = ({
  item,
  isOpen,
  onPress,
}) => {
  const heightAnim = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isOpen ? contentHeight : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOpen, contentHeight]);

  return (
    <View>
      <Pressable onPress={onPress} className="py-4 border-b border-[#E5E7EB]">
        <View className="felx flex-row items-center justify-between">
          <Text className="font-medium text-base">{item.name}</Text>
          {isOpen ? (
            <ChevronUpIcon width={20} height={20} />
          ) : (
            <ChevronDownIcon width={20} height={20} />
          )}
        </View>
      </Pressable>
      <Animated.View style={{ height: heightAnim, overflow: "hidden" }}>
        <View
          style={{ position: "absolute", opacity: 0, zIndex: -1 }}
          onLayout={(event) =>
            setContentHeight(event.nativeEvent.layout.height)
          }
        >
          <Text className="text-gray-600 p-2">{item.text}</Text>
        </View>
        <View>
          <Text className="text-gray-600 p-2">{item.text}</Text>
        </View>
      </Animated.View>
    </View>
  );
};
