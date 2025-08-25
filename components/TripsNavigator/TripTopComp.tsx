import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";

const TripTopComp = ({
  state,
  descriptors,
  navigation,
  setRoute,
  setPastorUpcomingorFailed,
}: MaterialTopTabBarProps & {
  setRoute: (route: string) => void;
  setPastorUpcomingorFailed: (route: string) => void;
}) => {
  const currentRouteName = state.routes[state.index].name;
  const bacendRouteKey =
    currentRouteName === "Upcoming Trips"
      ? "Pending"
      : currentRouteName === "Feedback Trips"
      ? "WaitingFeedback"
      : currentRouteName === "Past Trips"
      ? "Successfull"
      : currentRouteName === "Cancel Trips"
      ? "Cancelled"
      : "";

  useEffect(() => {
    setRoute(currentRouteName);
    setPastorUpcomingorFailed(bacendRouteKey);
  }, [bacendRouteKey, currentRouteName, setRoute, setPastorUpcomingorFailed]);

  return (
    <View className="flex flex-row items-center justify-between px-1">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        let label =
          typeof options.tabBarLabel === "string"
            ? options.tabBarLabel
            : typeof options.title === "string"
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            className="flex items-center justify-center pt-6 pb-2 mb-2"
            key={index}
            onPress={onPress}
          >
            <Text
              className={`font-bold text-sm ${
                isFocused ? "text-primary" : "text-secondary"
              }`}
            >
              {label}
            </Text>
            <View
              className={`absolute bottom-0 h-[2px] w-full ${
                isFocused ? "bg-primary" : "bg-transparent"
              }`}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TripTopComp;
