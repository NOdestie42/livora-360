import { useMutation } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Using Ionicons from Expo
import { ToggleLike } from "../BookingCarousel/request";
import Toast from "react-native-toast-message";

const SingleImpressiveProperty = ({
  likedBy,
  propertyId,
  storedUserId,
}: any) => {
  const [likedOrNot, setLikedOrNot] = useState<boolean>(false);
  const [localLikedBy, setLocalLikedBy] = useState<string[]>(likedBy);

  // Update state when likedBy is loaded or changes
  useEffect(() => {
    if (likedBy && storedUserId) {
      setLikedOrNot(likedBy.includes(storedUserId));
      setLocalLikedBy(likedBy);
    }
  }, [likedBy, storedUserId]);

  const mutation = useMutation({
    mutationFn: ToggleLike,
    onError: (error: Error, variables, context) => {
      // Revert the optimistic update on error
      setLikedOrNot(!likedOrNot);
      setLocalLikedBy((prev) =>
        likedOrNot
          ? prev.filter((id) => id !== storedUserId)
          : [...prev, storedUserId]
      );
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    },
    onSuccess: () => {
      // Optionally, you can refetch the data here to ensure the UI is in sync with the server
      // refetch();
    },
  });

  const handleLike = (id: string) => {
    // Optimistic update
    const newLikedOrNot = !likedOrNot;
    setLikedOrNot(newLikedOrNot);
    setLocalLikedBy((prev) =>
      newLikedOrNot
        ? [...prev, storedUserId]
        : prev.filter((id) => id !== storedUserId)
    );

    // Send the request to the server
    mutation.mutate({ liked: newLikedOrNot, propertyId: id });
  };

  return (
    <View className="flex flex-col items-center justify-center pt-2">
      <TouchableOpacity
        onPress={() => handleLike(propertyId)}
        activeOpacity={0.7}
      >
        <Ionicons
          name={likedOrNot ? "heart" : "heart-outline"}
          size={40}
          color={likedOrNot ? "#ef4444" : "#ffffff"} // red-500 and white
          style={{
            // Mimicking the transition-transform effect
            transform: [{ scale: 1 }],
          }}
        />
      </TouchableOpacity>
      <Text className="text-white text-[12px]">{localLikedBy.length} Likes</Text>
    </View>
  );
};

export default SingleImpressiveProperty;