import { View, Text } from 'react-native'
import React from 'react'
import ThreeDTopNavigator from '@/components/ThreeDTopNavigator'
import { useLocalSearchParams } from 'expo-router'

const ThreeDMedia = () => {
    const { id } = useLocalSearchParams()

    return (
        <View className="flex-1 bg-white">
            <View className="mt-6">
                <View className="h-screen">
                    <ThreeDTopNavigator id={id} />
                </View>
            </View>
        </View>
    )
}

export default ThreeDMedia