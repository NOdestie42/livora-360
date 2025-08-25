import { View, Text, Pressable } from "react-native";
import React from "react";
import SearchIcon from "../../assets/Search.svg";
import SearchSideIcon from "../../assets/SearchSide.svg";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

const SearchMain = () => {
  const router = useRouter();
  const { t } = useTranslation()
  return (
    <View className="w-[90%] mx-auto flex flex-row items-center justify-between pl-4 pr-2.5 mt-6 border border-[#00000014] rounded-full h-[56px]">
      <Pressable
        onPress={() => router.push("/search")}
        className="flex flex-row items-center gap-4"
      >
        <SearchIcon width={16} height={16} color={"#111"} />
        <View>
          <Text className="text-sm font-bold text-[#222222]">{t("SearchPlaceholder")}</Text>
          <Text className="text-[12px] text-[#717171]">
            {t("SearchSubtext")}
          </Text>
        </View>
      </Pressable>
      <Pressable >
        <SearchSideIcon width={36} height={36} />
      </Pressable>
    </View>
  );
};

export default SearchMain;
