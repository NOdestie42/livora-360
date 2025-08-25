import React, { useState } from 'react'
import ChooseOption from './ChooseOption'
import { ChooseOptionsTypes } from '@/types';

const Baths = ({ handleChange, bottomSheetRef }: ChooseOptionsTypes) => {
    const optionArray = ['1 Bath', '2 Baths', '4 Baths', '6 Baths', 'More than 6 Baths']

    const onSelect = (value: string) => {
        handleChange('baths', value);
        bottomSheetRef.current?.close();
    };

    return (
        <ChooseOption
            title='Baths'
            options={optionArray}
            onSelect={onSelect}
        />
    )
}

export default Baths
