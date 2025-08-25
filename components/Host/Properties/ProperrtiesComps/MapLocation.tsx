import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, MapPressEvent } from "react-native-maps";

interface MapLocationProps {
    setLocation: (coords: { lat: number; lng: number }) => void;
}

const MapLocation = ({ setLocation }: MapLocationProps) => {
    const [position, setPosition] = useState({
        latitude: 53.54992,
        longitude: 10.00678,
    });

    const handleMapPress = (e: MapPressEvent) => {
        const { latitude, longitude } = e.nativeEvent.coordinate;
        setPosition({ latitude, longitude });
    };

    const confirmLocation = () => {
        setLocation({ lat: position.latitude, lng: position.longitude });
    };

    return (
        <View className="w-full h-[500px] bg-white rounded-t-xl overflow-hidden">
            {/* Map */}
            <MapView
                style={{
                    flex: 1
                }}
                initialRegion={{
                    latitude: position.latitude,
                    longitude: position.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
                onPress={handleMapPress}
            >
                <Marker coordinate={position} draggable onDragEnd={e => setPosition(e.nativeEvent.coordinate)} />
            </MapView>

            {/* Done Button */}
            <View className="p-4 bg-white">
                <TouchableOpacity
                    onPress={confirmLocation}
                    className="bg-orange-500 rounded-md py-3"
                >
                    <Text className="text-center text-white text-base font-semibold">Done</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default MapLocation;
