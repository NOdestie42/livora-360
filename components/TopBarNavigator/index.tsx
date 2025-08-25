import React, { useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import House from "../House";
import Apartment from "../Apartment";
import TopTabWidgets from "../TopBarWidget";
import GuestHouse from "../GuestHouse";
import Hotel from "../Hotel";
import { useQuery } from "@tanstack/react-query";
import allProperties from "./request";
import TopTabCompRenderer from "./TopTabCompRenderer";
import { useTranslation } from "react-i18next";

const Tab = createMaterialTopTabNavigator();

const TopBarNavigator = () => {
  const [currentRouteName, setCurrentRouteName] = useState("House");
  const { t } = useTranslation()
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["all-properties", currentRouteName],
    queryFn: () => allProperties(currentRouteName),
  });

  return (
    <Tab.Navigator
      tabBar={(props) => (
        <TopTabWidgets setRoute={setCurrentRouteName} {...props} />
      )}
    >
      <Tab.Screen name="House">
        {() => (
          <TopTabCompRenderer
            Children={House}
            isLoading={isLoading}
            isError={isError}
            data={data}
            error={error}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Apartment">
        {() => (
          <TopTabCompRenderer
            Children={Apartment}
            isLoading={isLoading}
            isError={isError}
            data={data}
            error={error}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="GuestHouse">
        {() => (
          <TopTabCompRenderer
            Children={GuestHouse}
            isLoading={isLoading}
            isError={isError}
            data={data}
            error={error}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Hotel">
        {() => (
          <TopTabCompRenderer
            Children={Hotel}
            isLoading={isLoading}
            isError={isError}
            data={data}
            error={error}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default TopBarNavigator;
