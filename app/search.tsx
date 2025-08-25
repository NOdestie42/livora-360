import { View, Text, Pressable, TextInput } from "react-native";
import React from "react";
import SearchIcon from "../assets/Search.svg";
import BackArrow from "../assets/backArrow.svg";
import CrossIcon from "../assets/cross.svg";

import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
const Search = () => {
  const router = useRouter();
  const { t } = useTranslation()
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
        <View className="mt-4">
          <Text className="text-[#2B2B2B] font-semibold">{t("RecentSearch")}</Text>
          <View className="flex items-center mt-6">
            <View className="flex flex-row items-center justify-between w-full h-[44px]">
              <Text className="font-bold">Lahore, Pakistan</Text>
              <Pressable>
                <CrossIcon />
              </Pressable>
            </View>
            <View className="flex flex-row items-center justify-between w-full h-[44px]">
              <Text className="font-bold">Karachi</Text>
              <Pressable>
                <CrossIcon />
              </Pressable>
            </View>
            <View className="flex flex-row items-center justify-between w-full h-[44px]">
              <Text className="font-bold">Middle East</Text>
              <Pressable>
                <CrossIcon />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Search;
