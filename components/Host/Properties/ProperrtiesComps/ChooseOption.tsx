import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface ChooseOptionProps {
    title: string;
    options: string[];
    onSelect: (value: string) => void;
}

const ChooseOption = ({ title, options, onSelect }: ChooseOptionProps) => {
    return (
        <View className="pb-6">
            <Text className="text-center font-semibold text-xl border-primary border-b border-t py-2">{title}</Text>
            {options.map((value, index) => (
                <Pressable onPress={() => onSelect(value)} key={index}>
                    <Text className="text-center border-b py-2 border-primary text-secondary">
                        {value}
                    </Text>
                </Pressable>
            ))}
            <Pressable onPress={() => onSelect('')}>
                <Text className="text-center py-3 text-primary font-semibold border-primary border-b text-xl">Cancel</Text>
            </Pressable>
        </View>
    );
};

export default ChooseOption;
