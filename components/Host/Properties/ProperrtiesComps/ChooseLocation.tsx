import MapLocation from './MapLocation'
import { ChooseOptionsTypes } from '@/types'

const ChooseLocation = ({ handleChange, bottomSheetRef }: ChooseOptionsTypes) => {
    const onSelect = (value: { lat: number; lng: number; }) => {
        handleChange('location', `${value.lat},${value.lng}`);
        bottomSheetRef.current?.close();
    };

    return (
        <MapLocation setLocation={(coords) => onSelect(coords)} />
    )
}

export default ChooseLocation
