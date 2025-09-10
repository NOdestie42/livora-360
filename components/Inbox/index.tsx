import { View, Text, Pressable, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import BackArrow from "../../assets/backArrow.svg";
import { useRouter } from "expo-router";
import { Image } from "react-native";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { AllMessages } from "./request";
import Spinner from "../Spinner";
import Error from "../Error";
import { getItemFromAsyncStorage } from "@/AsyncStorage";

const InboxComop = () => {
  const router = useRouter();
  const { t } = useTranslation()

  const [storeId, setStoreId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const id = await getItemFromAsyncStorage("userId");
      setStoreId(id);
    })();
  }, []);


  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["all-messages"],
    queryFn: AllMessages,
    enabled: !!storeId,
  });


  if (isLoading) return <Spinner />;
  if (isError) return <Error error={error} />;

  const timeDifference = (date: string | Date) => {
    const currentTime = new Date();
    const givenTime = new Date(date);

    const timeDiff = currentTime.getTime() - givenTime.getTime(); // Time difference in milliseconds

    // Convert time difference to seconds, minutes, hours, and days
    const diffInSeconds = Math.floor(timeDiff / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      return `${diffInDays} days ago`;
    }
  };


  return (
    <View className="flex-1 bg-white">
      <View className="w-[90%] mx-auto mt-6">
        <View className="flex flex-row items-center gap-3">
          <Pressable onPress={() => router.push("/(tabs)")}>
            <BackArrow />
          </Pressable>
        </View>
        <Text className="text-[28px] font-semibold py-4">{t("Messages")}</Text>
        <View>
          <View className="mb-4">
            <TextInput
              placeholder={t("SearchMessages")}
              className="placeholder:text-[#939393] w-full bg-[#f7f4f4] px-2 py-3"
            />
          </View>
          <View className="flex flex-col-reverse">
            {data?.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-col-reverse"
              >
                {item.participants
                  .filter((participant) => participant._id !== storeId)
                  .map((participant, pIndex) => (
                    <TouchableOpacity
                      key={pIndex}
                      className="flex flex-row items-center justify-between py-3"
                      onPress={() => {
                        router.push(`/chat/${item._id}`)
                      }}
                    >
                      <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
                        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
                          <View>
                            {data.length > 0 && (
                              <View>
                                {item.starred?.includes(storeId ?? "") ? (
                                  <Text style={{ color: "blue", fontSize: 20 }}>★</Text>
                                ) : (
                                  <Text style={{ fontSize: 20 }}>☆</Text>
                                )}
                              </View>
                            )}
                          </View>
                          <Image
                            source={{ uri: participant.profilePic }}
                            style={{
                              width: 42,
                              height: 42,
                              borderRadius: 21,
                              borderWidth: 1,
                              borderColor: "#000",
                            }}
                          />
                        </View>

                        {/* Name + Last Message */}
                        <View>
                          <Text style={{ fontSize: 13, fontWeight: "600" }}>
                            {participant.firstName}
                          </Text>
                          <Text style={{ fontSize: 12, color: "#6C6C6C" }}>
                            {item.messages[item.messages.length - 1]?.message &&
                              item.messages[item.messages.length - 1]?.message.message !== ""
                              ? item.messages[item.messages.length - 1].message.message
                              : `${item.messages[item.messages.length - 1]?.message.file
                                ?.length ?? 0
                              } File`}
                          </Text>
                        </View>
                      </View>

                      {/* Time */}
                      <View>
                        <Text style={{ fontSize: 12, color: "#717171" }}>
                          {timeDifference(
                            item.messages[item.messages.length - 1]?.createdAt
                          )}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default InboxComop;
