import { View, Text, Pressable, TouchableOpacity, Image, Platform } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import BackArrow from "../../assets/backArrow.svg";

const openApp = async (appUrls: string[], packageName: string, fallbackUrl: string) => {
  try {
    // Try each possible app URL scheme
    for (const url of appUrls) {
      try {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
          return;
        }
      } catch (err) {
        console.log(`Failed to open URL ${url}: ${err}`);
        // Continue to the next URL if this one fails
      }
    }

    // For Android, try a more robust intent URI
    if (Platform.OS === "android" && packageName) {
      const intentUrl = `intent://#Intent;package=${packageName};scheme=indrive;end`;
      try {
        const supported = await Linking.canOpenURL(intentUrl);
        if (supported) {
          await Linking.openURL(intentUrl);
          return;
        }
      } catch (err) {
        console.log(`Failed to open Android intent ${intentUrl}: ${err}`);
      }
    }
    await Linking.openURL(fallbackUrl);
  } catch (err) {
    console.error(`Error in openApp: ${err}`);
    await Linking.openURL(fallbackUrl);
  }
};

const GuestShopComp = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="w-[90%] mx-auto mt-6">
        {/* Back Button */}
        <Pressable onPress={() => router.back()}>
          <BackArrow />
        </Pressable>

        <Text className="text-[28px] font-semibold py-4">Guest Shop</Text>

        <View className="flex flex-row items-center gap-4">
          {/* inDrive */}
          <TouchableOpacity
            onPress={() =>
              openApp(
                ["indrive://", "indriver://"], // Simplified schemes (removed taxsee:// as it's unrelated)
                "sinet.startup.inDriver",
                "https://play.google.com/store/apps/details?id=sinet.startup.inDriver"
              )
            }
          >
            <Image
              source={require("../../assets/images/indrive.jpg")}
              style={{ width: 60, height: 60, borderRadius: 8 }}
            />
          </TouchableOpacity>

          {/* Foodpanda */}
          <TouchableOpacity
            onPress={() =>
              openApp(
                ["foodpanda://"],
                "com.global.foodpanda.android",
                "https://play.google.com/store/apps/details?id=com.global.foodpanda.android"
              )
            }
          >
            <Image
              source={require("../../assets/images/foodPanda.png")}
              style={{ width: 60, height: 60, borderRadius: 8 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default GuestShopComp;
