import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import TripTopComp from "./TripTopComp";
import Upcoming from "./Upcoming";
import Feedback from "./Feedback";
import Past from "./Past";
import Cancel from "./Cancel";
import { useQuery } from "@tanstack/react-query";
import { TripList } from "./request";

const Tab = createMaterialTopTabNavigator();

const TripNavigator = () => {
  const [currentRouteName, setCurrentRouteName] = useState("Pending");
  const [PastorUpcomingorFailed, setPastorUpcomingorFailed] =
    useState<string>("Pending");

  const { isPending, isError, data, error } = useQuery({
    queryKey: [PastorUpcomingorFailed],
    queryFn: () => TripList(PastorUpcomingorFailed),
  });

  return (
    <Tab.Navigator
      tabBar={(props) => (
        <TripTopComp
          setPastorUpcomingorFailed={setPastorUpcomingorFailed}
          setRoute={setCurrentRouteName}
          {...props}
        />
      )}
    >
      <Tab.Screen name="Upcoming Trips">
        {() => (
          <Upcoming
            isPending={isPending}
            isError={isError}
            data={data}
            error={error}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Feedback Trips">
        {() => (
          <Feedback
            isPending={isPending}
            isError={isError}
            data={data}
            error={error}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Past Trips">
        {() => (
          <Past
            isPending={isPending}
            isError={isError}
            data={data}
            error={error}
          />
        )}
      </Tab.Screen>
      <Tab.Screen name="Cancel Trips">
        {() => (
          <Cancel
            isPending={isPending}
            isError={isError}
            data={data}
            error={error}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default TripNavigator;
