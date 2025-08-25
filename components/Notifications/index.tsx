import React from "react";
import Error from "../Error";
import Spinner from "../Spinner";
import { useRouter } from "expo-router";
import { GetNotification } from "./request";
import { useQuery } from "@tanstack/react-query";
import BackArrow from "../../assets/backArrow.svg";
import BellRounded from "../../assets/roundedBell.svg";
import { ScrollView } from "react-native-gesture-handler";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

const NotificationsComp = () => {
  const router = useRouter();
  const { t } = useTranslation()
  const { isPending, isError, data, error } = useQuery({
    queryKey: ["user-notification"],
    queryFn: GetNotification,
  });

  const unreadCount = data?.filter((n) => !n.read).length || 0;

  const handleClearAll = () => {
    // Implement logic to clear notifications
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
                  key={index}
                  className={`p-3 rounded-lg ${notification.read ? "bg-gray-100" : "bg-primary/10"
                    }`}
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
