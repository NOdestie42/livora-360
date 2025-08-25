import {
  View,
  Text,
  Dimensions,
  ImageBackground,
  Pressable,
  Animated,
} from "react-native";
import React, { useEffect, useState, useRef, memo, useCallback } from "react";
import PagerView from "react-native-pager-view";
import CarouselIcons from "./CarouselIcons";
import {
  BookingCarouselProps,
  ToggleLikeResponse,
  ToggleLikeVariables,
} from "@/types";
import DynamicStar from "./DynamicStar";
import HeartToFill from "../../assets/HeartToFill.svg";
import { getItemFromAsyncStorage } from "@/AsyncStorage";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { ToggleLike } from "./request";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/utils/CurrencyContext";

const BookingCarousel = memo(({
  data,
  title,
  rent,
  totalReviews,
  avgRating,
  likedBy,
  propertyId,
}: BookingCarouselProps) => {
  const [activePage, setActivePage] = useState(0);
  const [isHeartFilled, setIsHeartFilled] = useState(false);
  const { width } = Dimensions.get("window");
  const router = useRouter();
  const { t } = useTranslation()
  const { currency, formatPrice } = useCurrency()
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePageSelected = useCallback((e: { nativeEvent: { position: number } }) => {
    setActivePage(e.nativeEvent.position);
  }, []);

  const animateHeart = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.3,
        useNativeDriver: true,
        speed: 50,
        bounciness: 12,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 12,
      }),
    ]).start();
  };

  const toggleHeartFill = () => {
    setIsHeartFilled(!isHeartFilled);
    animateHeart();
    mutate({ liked: !isHeartFilled, propertyId });
  };

  useEffect(() => {
    let isMounted = true;

    const checkLikedStatus = async () => {
      try {
        const userId = await getItemFromAsyncStorage("userId");
        if (isMounted && userId && Array.isArray(likedBy)) {
          setIsHeartFilled(
            likedBy.some((item) => item._id === userId) ||
            likedBy.includes(userId)
          );
        }
      } catch (error) {
        console.error("Error checking liked status:", error);
      }
    };

    checkLikedStatus();

    return () => {
      isMounted = false;
    };
  }, [likedBy]);

  const {
    mutate,
  }: UseMutationResult<
    ToggleLikeResponse,
    Error,
    ToggleLikeVariables,
    unknown
  > = useMutation({
    mutationKey: ["toggle-like"],
    mutationFn: ToggleLike,
    onError: () => {
      // Revert UI state if API call fails
      setIsHeartFilled(isHeartFilled);
    },
  });

  return (
    <View>
      <View className="flex items-center justify-center pt-4 relative">
        <PagerView
          style={{
            width: width - 40,
            height: 400,
            borderRadius: 14,
          }}
          initialPage={0}
          pageMargin={5}
          onPageSelected={handlePageSelected}
        >
          {data &&
            data.map((item: string, index: number) => (
              <Pressable
                key={index}
                onPress={() => router.push(`/3d-details/${propertyId}`)}
                style={{ flex: 1 }}
              >
                <ImageBackground
                  source={{ uri: item }}
                  style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                    borderRadius: 15,
                  }}
                />
              </Pressable>
            ))}
        </PagerView>
        <View
          style={{
            width: width - 30,
            height: 400,
          }}
          pointerEvents="none"
          className="mx-auto absolute top-4 z-10 rounded-[14px]"
        >
          <View className="absolute bottom-10 left-4 right-4 flex-row justify-between items-center">
            <Text className="text-white font-semibold">{title}</Text>
            <View className="flex items-center justify-center gap-1">
              {totalReviews && totalReviews.length > 0 ? (
                <DynamicStar avgRating={avgRating} />
              ) : null}
              <Text className="text-white text-[12px] font-bold">
                {avgRating}/({totalReviews.length})
              </Text>
            </View>
          </View>
        </View>
        <View className="flex flex-row items-center justify-center">
          <View className="flex-row justify-center items-center mt-8 absolute bottom-2">
            {data &&
              data.map((_: any, index: number) => (
                <View
                  key={index}
                  style={{
                    width: index === activePage ? 26 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor:
                      index === activePage ? "#0582CA" : "#E5E7EB",
                    marginHorizontal: 4,
                  }}
                />
              ))}
          </View>
        </View>

        <Pressable
          onPress={toggleHeartFill}
          className="absolute top-10 right-4 z-10"
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <HeartToFill
              fill={"red"}
              fillOpacity={isHeartFilled ? 1 : 0.1}
              stroke={"red"}
              width={28}
              height={28}
            />
          </Animated.View>
        </Pressable>
      </View>
      <View className="flex flex-row items-center justify-between mt-3">
        <CarouselIcons size={18} />
        <View className="flex flex-row items-center">
          <Text className="text-primary font-extrabold text-xl">{formatPrice(rent)}</Text>
          <Text className="text-secondary px-1">/</Text>
          <Text className="text-secondary">{t("Night")}</Text>
        </View>
      </View>
    </View>
  );
});

BookingCarousel.displayName = 'BookingCarousel';

export default BookingCarousel;
