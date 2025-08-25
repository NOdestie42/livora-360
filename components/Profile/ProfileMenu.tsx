import { View, Text, Pressable } from "react-native";
import React from "react";
import ForwardArror from "../../assets/forwardArrow.svg";
import { SvgProps } from "react-native-svg";

const ProfileMenu = ({
  Svg,
  text,
  onPress,
}: {
  Svg: React.FunctionComponent<SvgProps>;
  text: string;
  onPress?: () => void;
}) => {
  return (
    <Pressable onPress={onPress}>
      <View className="w-full flex flex-row items-center justify-between">
        <View className="flex flex-row items-center gap-2">
          <Svg width={35} height={35} />
          <Text className="font-bold text-sm">{text}</Text>
        </View>
        <ForwardArror width={12} height={12} />
      </View>
    </Pressable>
  );
};

export default ProfileMenu;
