import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { MaterialTopTabBarProps } from '@react-navigation/material-top-tabs'
import Pictures from '../../assets/picture.svg'
import Video from '../../assets/Video.svg'
import { useTranslation } from 'react-i18next'

const allSvgs = {
    Pictures: Pictures,
    Video: Video,
};

const MediaTopWidgt: React.FC<
    MaterialTopTabBarProps & { setRoute: (route: string) => void }
> = ({ state, descriptors, navigation, setRoute }) => {
    const currentRouteName = state.routes[state.index].name;
    const { t } = useTranslation()
    useEffect(() => {
        setRoute(currentRouteName);
    }, [currentRouteName, setRoute]);

    return (
        <View className="mx-auto flex flex-row items-center justify-between px-1">
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];

                let label =
                    typeof options.tabBarLabel === "string"
                        ? options.tabBarLabel
                        : typeof options.title === "string"
                            ? options.title
                            : route.name;

                const isFocused = state.index === index;

                const SvgComponent = allSvgs[label as keyof typeof allSvgs];

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
                        className="flex items-center justify-center pt-6 pb-2 w-[50%]"
                        key={index}
                        onPress={onPress}
                    >
                        {SvgComponent && (
                            <SvgComponent
                                width={24}
                                height={24}
                                color={isFocused ? "#0582CA" : "#A7A7A7"}
                            />
                        )}

                        <Text className={`font-bold pt-2 ${isFocused ? "text-primary" : "text-secondary"}`}
                        >
                            {t(label)}
                        </Text>
                        <View className={`absolute bottom-0 h-[2px] w-full ${isFocused ? "bg-primary" : "bg-transparent"}`} />
                    </TouchableOpacity>
                );
            })}
        </View>
    )
}

export default MediaTopWidgt
