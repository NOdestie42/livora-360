import React, { useState } from 'react'
import { Text } from 'react-native'
import ChooseOption from './ChooseOption'
import { ChooseOptionsTypes } from '@/types'

const Beds = ({ handleChange, bottomSheetRef }: ChooseOptionsTypes) => {
    const optionArray = ['1 Bed', '2 Beds', '4 Beds', '6 Beds', 'More than 6 Beds']

    const onSelect = (value: string) => {
        handleChange('beds', value);
        bottomSheetRef.current?.close();
    };

    return (
        <ChooseOption onSelect={onSelect} title='Baths' options={optionArray} />
    )
}

export default Beds
