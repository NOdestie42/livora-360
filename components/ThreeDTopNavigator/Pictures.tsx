import { View, ImageBackground, Image } from 'react-native'
import React from 'react'
import { LocationData } from '@/types'

const Pictures = ({ data }: { data: LocationData }) => {
    return (
        <View className='flex-1 bg-white'>
            <View className='px-1 py-1 flex flex-row items-center gap-1 flex-wrap'>
                {data.files.map((value, index) => (
                    <Image key={index} className='w-36 h-36' source={{ uri: value }} />
                ))}
            </View>
        </View>
    )
}

export default Pictures
