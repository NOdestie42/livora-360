import React, { RefObject, useState } from 'react';
import ChooseOption from './ChooseOption';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { ChooseOptionsTypes } from '@/types';

const LocationTypes = ({ handleChange, bottomSheetRef }: ChooseOptionsTypes) => {
    const optionArray = ['House', 'Apartment', 'Guesthouse', 'Hotel'];

    const onSelect = (value: string) => {
        handleChange('propertyType', value);
        bottomSheetRef.current?.close();
    };

    return (
        <ChooseOption
            title="Property Type"
            options={optionArray}
            onSelect={onSelect}
        />
    );
};

export default LocationTypes;
