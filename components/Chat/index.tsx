import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import { Pressable, Text, View } from 'react-native'
import BackArrow from '../../assets/backArrow.svg'
import { useQueryClient } from '@tanstack/react-query'
import { getItemFromAsyncStorage } from '@/AsyncStorage'

const ChatComp = ({ id }: { id: string | string[] }) => {
    const router = useRouter();
    const [storedId, setStoredId] = useState<string | null>(null)
    const queryCLient = useQueryClient();

    useEffect(() => {
        const getId = async () => {
            const id = await getItemFromAsyncStorage('userId')
            setStoredId(id)
        }
        getId()

        if (storedId) {
            
        }
    }, [storedId])

    return (
        <View className="flex-1 bg-white">
            <View className="w-[90%] mx-auto mt-6">
                <View className="flex flex-row items-center gap-3">
                    <Pressable onPress={() => router.push("/(tabs)")}>
                        <BackArrow />
                    </Pressable>
                </View>
                <Text>{id}</Text>
            </View>
        </View>
    )
}

export default ChatComp
