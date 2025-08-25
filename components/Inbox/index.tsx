import { View, Text, Pressable, TextInput } from "react-native";
import React from "react";
import BackArrow from "../../assets/backArrow.svg";
import { useRouter } from "expo-router";
import { Image } from "react-native";
import { useTranslation } from "react-i18next";

const InboxComop = () => {
  const router = useRouter();
  const { t } = useTranslation()
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
          <View className="flex items-center justify-between gap-4">
            <View className="w-full flex flex-row items-center justify-between">
              <View>
                <View></View>
                <View className="flex flex-row items-center justify-center gap-2">
                  <Image
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 50,
                      marginRight: 4
                    }}
                    source={require('../../assets/defaultPic.jpg')}
                  />
                  <View>
                    <Text className="font-semibold">Arlene McCoy</Text>
                    <Text className="text-[#6C6C6C] text-sm">Haha oh man</Text>
                  </View>
                </View>
              </View>
              <View>
                <Text className="text-sm">12m</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default InboxComop;
