import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Pictures from './Pictures';
import MediaTopWidgt from './MediaTopWidgt';
import Video from './Video';
import TopTabCompRenderer from '../TopBarNavigator/TopTabCompRenderer';
import { useQuery } from '@tanstack/react-query';
import { getSingle } from './request';
import Review from './Review';

const ThreeDTopNavigator = ({ id }: { id: string | string[] }) => {
    const Tab = createMaterialTopTabNavigator();
    const [currentRouteName, setCurrentRouteName] = useState("Pictures");

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["single-property", id],
        queryFn: () => getSingle(id)
    })

    return (
        <Tab.Navigator tabBar={(props) => (
            <MediaTopWidgt setRoute={setCurrentRouteName} {...props} />
        )}>
            <Tab.Screen name="Pictures">
                {() => <TopTabCompRenderer
                    Children={Pictures}
                    isLoading={isLoading}
                    isError={isError}
                    data={data}
                    error={error}
                />}
            </Tab.Screen>
            <Tab.Screen name="Video">
                {() => <TopTabCompRenderer
                    Children={Video}
                    isLoading={isLoading}
                    isError={isError}
                    data={data}
                    error={error}
                />}
            </Tab.Screen>
            <Tab.Screen name="Review">
                {() => <TopTabCompRenderer
                    Children={(props) => <Review {...props} id={id} />}
                    isLoading={isLoading}
                    isError={isError}
                    data={data}
                    error={error}
                />}
            </Tab.Screen>
        </Tab.Navigator>
    )
}

export default ThreeDTopNavigator
