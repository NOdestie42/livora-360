import React, { useState, useEffect } from "react"; // Import useState and useEffect
import Error from "../Error";
import Spinner from "../Spinner";
import { useRouter } from "expo-router";
import { GetNotification } from "./request"; // Assuming this is the correct path to your GetNotification function
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Import useQueryClient
import BackArrow from "../../assets/backArrow.svg";
import BellRounded from "../../assets/roundedBell.svg";
import { ScrollView } from "react-native-gesture-handler";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

const NotificationsComp = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const queryClient = useQueryClient(); // Get the queryClient instance

  // State to trigger a refresh of notifications
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["user-notification"],
    queryFn: GetNotification, // This function should be correctly fetching data from your backend
  });

  // If you have a way to know when a new booking is made (e.g., via context, a global state, or a callback)
  // you would set refreshTrigger to a new value to force a refetch.
  // For now, we'll assume that calling queryClient.invalidateQueries() is sufficient,
  // or you might need to manually call setRefreshTrigger in your booking completion logic.

  // --- IMPORTANT: How to trigger the refresh ---
  // The most direct way with react-query is to invalidate the query cache.
  // This tells react-query to refetch the data the next time it's needed.
  // You'll need to call this from where your booking logic resides.
  // For example, after a successful booking POST request:
  // queryClient.invalidateQueries({ queryKey: ["user-notification"] });

  // If you want to use the state variable approach:
  useEffect(() => {
    const fetchNotifications = async () => {
      // This part might be redundant if useQuery already handles refetching
      // when queryClient.invalidateQueries is called.
      // However, if you need explicit re-fetching based on a trigger,
      // you can call GetNotification here.
      try {
        // If GetNotification is called directly, ensure it gets the correct userId if needed
        const data = await GetNotification();
        // Manually update the cache with the new data
        queryClient.setQueryData(["user-notification"], data);
      } catch (error) {
        console.error("Failed to refetch notifications:", error);
      }
    };

    // Fetch when the component mounts OR when refreshTrigger changes.
    // If using queryClient.invalidateQueries, this useEffect might not need to call GetNotification directly,
    // but just rely on the automatic refetch triggered by the invalidation.
    // If you still need manual control:
    // fetchNotifications();
  }, [refreshTrigger, queryClient]); // Add refreshTrigger to dependencies


  const unreadCount = data?.filter((n) => !n.read).length || 0;

  const handleClearAll = () => {
    // Implement logic to clear notifications
    // This would likely involve another API call to your backend
    // After clearing, you'd want to refetch notifications
    // For example:
    // await apiCallToDeleteAllNotifications();
    // queryClient.invalidateQueries({ queryKey: ["user-notification"] });
  };

  if (isPending) {
    return <Spinner />;
  }

  if (isError) {
    return <Error error={error} />;
  }

  return (
    <View className="flex-1 bg-white">
      <View className="w-[90%] mx-auto mt-6 mb-2">
        <View className="flex flex-row items-center justify-between mb-4">
          <Pressable onPress={() => router.back()}>
            <BackArrow />
          </Pressable>

          <Pressable onPress={handleClearAll}>
            <Text className="font-semibold text-sm text-primary">
              {t("ClearAll")}
            </Text>
          </Pressable>
        </View>

        <Text className="text-[28px] font-semibold py-4">{t("Notifications")}</Text>

        <View className="flex flex-row items-center justify-between mb-4">
          <View className="flex flex-row items-center gap-2">
            <Text className="text-secondary text-base">
              {t("RecentNotifications")}
            </Text>
            {unreadCount > 0 && (
              <View className="w-[22px] h-[22px] flex items-center justify-center rounded-full bg-primary">
                <Text className="text-white font-bold text-xs">
                  {unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>

        {data?.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-8">
            <Text className="text-gray-500 text-lg">No notifications yet</Text>
          </View>
        ) : (
          <ScrollView>
            <View className="flex gap-2">
              {data.map((notification, index) => (
                <TouchableOpacity
                  key={index} // Consider using notification._id if available and unique for keys
                  className={`p-3 rounded-lg ${notification.read ? "bg-gray-100" : "bg-primary/10"
                    }`}
                  onPress={() => {
                    // If you want to mark as read on press:
                    // Call an API to mark notification as read
                    // Then invalidate the query to refetch
                    // queryClient.invalidateQueries({ queryKey: ["user-notification"] });
                  }}
                >
                  <View className="flex flex-row items-start gap-4">
                    <BellRounded width={30} height={30} />
                    <View className="flex-1">
                      <Text
                        className={`text-sm font-semibold ${!notification.read && "text-primary"
                          }`}
                      >
                        {notification.type}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        {notification.message}
                      </Text>
                    </View>
                    <Text className="text-xs text-secondary">
                      {formatDistanceToNow(new Date(notification.date), {
                        addSuffix: true,
                      })}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
};

export default NotificationsComp;