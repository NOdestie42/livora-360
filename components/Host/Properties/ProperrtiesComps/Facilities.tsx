import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Pressable } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ChooseOptionsTypes } from '@/types';
import CustomButton from '@/components/CustomButton';

const FACILITIES = [
    'Courtyard view',
    'Waterfront',
    'WiFi',
    'Dedicated workspace',
    'Pets allowed',
    'Alaram',
    'Parking',
    'Security',
    'Other'
];

interface FacilitiesProps extends ChooseOptionsTypes {
    selectedFacilities: string[];
}

const Facilities = ({ handleChange, bottomSheetRef, selectedFacilities }: FacilitiesProps) => {
    // Local state to handle multi-select
    const [localSelected, setLocalSelected] = useState<string[]>([]);

    const [search, setSearch] = useState('');

    // Initialize local state when the component mounts or parent changes
    useEffect(() => {
        setLocalSelected(selectedFacilities);
    }, [selectedFacilities]);

    // Toggle selection locally
    const onToggle = (item: string) => {
        setLocalSelected(prev =>
            prev.includes(item) ? prev.filter(f => f !== item) : [...prev, item]
        );
    };

    // Filter facilities by search
    const filteredFacilities = FACILITIES.filter(f =>
        f.toLowerCase().includes(search.toLowerCase())
    );

    // When user taps DONE, push local selections to parent and close the sheet
    const onDone = () => {
        handleChange('facilities', localSelected);
        bottomSheetRef?.current?.close?.();
    };

    return (
        <View className="flex-1 bg-white">
            <Text className="font-semibold text-base px-4 pt-4">Select Facilities</Text>

            {/* Search Input */}
            <View className="mx-4 mt-2 border border-gray-200 rounded-full px-4 flex-row items-center">
                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search facilities"
                    className="flex-1 py-2 text-sm"
                />
            </View>

            {/* Selected Pills */}
            {localSelected.length > 0 && (
                <View className="flex flex-row flex-wrap gap-2 px-4 mt-4">
                    {localSelected.map(item => (
                        <View key={item} className="bg-blue-100 px-3 py-1 rounded-full">
                            <Text className="text-textPrimary text-xs font-semibold">{item}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Scrollable Options */}
            <ScrollView className="flex-1 mt-4 px-2">
                {filteredFacilities.map(item => {
                    const selected = localSelected.includes(item);
                    return (
                        <Pressable
                            key={item}
                            onPress={() => onToggle(item)}
                            className={`px-4 py-3 border-b border-gray-100 rounded-md ${selected ? 'bg-blue-50' : ''}`}
                        >
                            <Text className="text-sm">{item}</Text>
                        </Pressable>
                    );
                })}
            </ScrollView>

            {/* Done Button */}
            <TouchableOpacity
                onPress={onDone}
                className="bg-primary py-3 justify-center items-center mx-4 my-4 rounded-md"
            >
                <CustomButton text={'Done'} />
            </TouchableOpacity>
        </View>
    );
};

export default Facilities;
