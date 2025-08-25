import { useRouter } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { Image, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native'
import BackArrow from "../../../assets/backArrow.svg";
import CustomInput from '@/components/CustomInput';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import CustomButton from '@/components/CustomButton';
import * as ImagePicker from 'expo-image-picker';
import LocationTypes from './ProperrtiesComps/LocationTypes';
import Beds from './ProperrtiesComps/Beds';
import Baths from './ProperrtiesComps/Baths';
import Facilities from './ProperrtiesComps/Facilities';
import ChooseLocation from './ProperrtiesComps/ChooseLocation';
import getCityName from '@/utils/getLocationViaLatLng';
import { useMutation } from '@tanstack/react-query';
import { AddLocationData, FileItem } from '@/types';
import { addLocation } from './request';
import Toast from 'react-native-toast-message';
import { useUserContext } from '@/utils/UserAiBookingContext';
import { useTranslation } from 'react-i18next';

const CreateProperties = () => {
    const router = useRouter();
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [inputChange, setInputChange] = useState('')
    const [selected, setSelected] = useState("yes");
    const { userAnswers } = useUserContext()
    const { t } = useTranslation()
    const [files, setFiles] = useState<FileItem[]>([]);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [cityName, setCityName] = useState('')
    const [formData, setFormData] = useState({
        title: userAnswers.propertyName,
        propertyType: userAnswers.propertyType,
        location: '',
        beds: String(userAnswers.beds) === '0' ? '' : String(userAnswers.beds),
        baths: String(userAnswers.baths) === '0' ? '' : String(userAnswers.baths),
        size: String(userAnswers.size) === '0' ? '' : String(userAnswers.size),
        overview: '',
        facilities: [] as string[],
        rate: String(userAnswers.rentalRate) === '0' ? '' : String(userAnswers.rentalRate),
        maxPersons: String(userAnswers.maxPersons) === '0' ? '' : String(userAnswers.maxPersons),
        licenseId: '',
        isFurnished: 'yes',
        livoraLink: '',
    });

    const [lat, lng] = formData.location.split(',').map(Number);

    const fetchCityName = async () => {
        const city = await getCityName(lat, lng);
        if (city) {
            setCityName(city);
        }
    };


    useEffect(() => {
        if (lat != 0 && lng != 0) {
            fetchCityName()
        }

    }, [formData.location])
    const handleChange = <K extends keyof typeof formData>(
        key: K,
        value: typeof formData[K]
    ) => {
        setFormData(prev => ({ ...prev, [key]: value }));

        setErrors(prev => {
            const newErrors = { ...prev };
            if (newErrors[key]) {
                delete newErrors[key];
            }
            return newErrors;
        });
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.title.trim()) newErrors.title = "Title is required.";
        if (!formData.propertyType.trim()) newErrors.propertyType = "Property type is required.";
        if (!formData.location.trim()) newErrors.location = "Location is required.";
        if (!formData.beds || Number(formData.beds) <= 0) newErrors.beds = "Beds must be greater than 0.";
        if (!formData.baths || Number(formData.baths) <= 0) newErrors.baths = "Baths must be greater than 0.";
        if (!formData.size || Number(formData.size) <= 0) newErrors.size = "Size must be greater than 0.";
        if (!formData.overview.trim() || formData.overview.length < 10) newErrors.overview = "Overview must be at least 10 characters.";
        if (!formData.facilities.length) newErrors.facilities = "Select at least one facility.";
        if (!formData.rate || Number(formData.rate) <= 0) newErrors.rate = "Rate must be greater than 0.";
        if (!formData.maxPersons || Number(formData.maxPersons) <= 0) newErrors.maxPersons = "Maximum persons must be greater than 0.";
        if (formData.livoraLink && !/^https?:\/\/.+/.test(formData.livoraLink)) newErrors.livoraLink = "Livora link must be a valid URL.";
        if (!['yes', 'no'].includes(formData.isFurnished)) newErrors.isFurnished = "Furnishing status required.";
        if (!files.length) newErrors.files = "At least one image or video is required.";

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const pickImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            const newFiles: FileItem[] = result.assets.map((asset) => ({
                uri: asset.uri,
                name: asset.fileName ?? 'image.jpg',
                type: asset.type ?? 'image/jpeg',
            }));


            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const options = [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
    ];

    const mutation = useMutation<void, Error, AddLocationData>({
        mutationFn: addLocation,
        onSuccess: () => {
            console.log('adsahjdksahkjhdsajkh');
            router.back()
        },
        onError: () => {
            // console.log()
        }
    });

    const extractNumberFromOption = (value: string): number => {
        if (/more than 6/i.test(value)) return 8;

        const match = value.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
    };


    const handleMutation = () => {
        // if (!validateForm()) {
        //     return;
        // }

        mutation.mutate({
            title: formData.title,
            type: formData.propertyType,
            baths: extractNumberFromOption(formData.baths),
            beds: extractNumberFromOption(formData.beds),
            facilities: formData.facilities,
            files: files,
            furnished: formData.isFurnished,
            license: formData.licenseId,
            link: formData.livoraLink,
            location: { lat, lng },
            maxpersons: Number(formData.maxPersons),
            overview: formData.overview,
            rent: Number(formData.rate),
            size: formData.size,
        })
    }


    return (
        <GestureHandlerRootView>
            <View className="flex-1 bg-white">
                <ScrollView>
                    <View className="w-[90%] mx-auto mt-6">
                        <View className="flex flex-row items-center justify-between">
                            <Pressable onPress={() => router.back()}>
                                <BackArrow />
                            </Pressable>
                            <Text className="font-semibold text-lg">{t("Create Property")}</Text>
                            <View></View>
                        </View>
                        <Text className='font-extrabold text-2xl pt-6'>{t("Add New Property")}</Text>
                        <View className="flex flex-col gap-4 mt-2">
                            <CustomInput
                                value={formData.title}
                                onChangeText={(text: string) => handleChange('title', text)}
                                size={'sm'} placeholder={t('Property Title')} onFocus={() => {
                                    setInputChange('Property Title');
                                }} />
                            {errors.title && <Text className="text-red-500 text-sm">{errors.title}</Text>}
                            <CustomInput value={formData.propertyType} size={'sm'} editable={false} placeholder={t('Property Type')} onFocus={() => {
                                setInputChange('Property Type');
                            }} />
                            {errors.propertyType && <Text className="text-red-500 text-sm">{errors.propertyType}</Text>}
                            <CustomInput size={'sm'} value={cityName} editable={false} placeholder={t('Location')} onFocus={() => {
                                setInputChange('Location');
                            }} />

                            {errors.location && <Text className="text-red-500 text-sm">{errors.location}</Text>}
                            <CustomInput value={formData.beds} size={'sm'} editable={false} placeholder={t('Beds')} onFocus={() => {
                                setInputChange('Beds');
                            }} />
                            {errors.beds && <Text className="text-red-500 text-sm">{errors.beds}</Text>}
                            <CustomInput value={formData.baths} size={'sm'} editable={false} placeholder={t('Baths')} onFocus={() => {
                                setInputChange('Baths');
                            }} />
                            {errors.baths && <Text className="text-red-500 text-sm">{errors.baths}</Text>}
                            <CustomInput value={formData.size}
                                onChangeText={(text: string) => handleChange('size', text)}
                                size={'sm'} keyboardType="numeric" placeholder={t('Size / Area')} onFocus={() => {
                                    setInputChange('Size');
                                }} />
                            {errors.size && <Text className="text-red-500 text-sm">{errors.size}</Text>}
                            <TextInput multiline={true}
                                numberOfLines={5}
                                className='px-3 rounded-md text-[16px] w-full py-3 text-textPrimary border-[#E0E0E0] border-b-2 focus:border-primary'
                                placeholder={t('Overview')}
                                placeholderTextColor={'#999999'}
                                value={formData.overview}
                                onChangeText={(text: string) => handleChange('overview', text)}
                            />
                            {errors.overview && <Text className="text-red-500 text-sm">{errors.overview}</Text>}
                            <CustomInput value={String(formData.facilities)} size={'sm'} editable={false} placeholder={t('Facilities')} onFocus={() => {
                                setInputChange('Facilities');
                            }} />
                            {errors.facilities && <Text className="text-red-500 text-sm">{errors.facilities}</Text>}
                            <CustomInput size={'sm'} keyboardType="numeric" value={formData.rate} onChangeText={(text: string) => handleChange('rate', text)} placeholder={t('Rental Rate (€) Per Night')} />
                            {errors.rate && <Text className="text-red-500 text-sm">{errors.rate}</Text>}
                            <CustomInput size={'sm'} keyboardType="numeric" value={formData.maxPersons} onChangeText={(text: string) => handleChange('maxPersons', text)} placeholder={t('Maximum persons')} />
                            {errors.maxPersons && <Text className="text-red-500 text-sm">{errors.maxPersons}</Text>}
                            <CustomInput size={'sm'} value={formData.licenseId} onChangeText={(text: string) => handleChange('licenseId', text)} placeholder={t('Add License ID')} />
                            <Text className='font-bold'>{t("House Furnished")}</Text>
                            <View className="flex-row items-center gap-6">
                                {options.map((opt) => {
                                    const isSelected = selected === opt.value;
                                    return (
                                        <Pressable
                                            key={opt.value}
                                            onPress={() => setSelected(opt.value)}
                                            className="flex-row items-center"
                                        >
                                            <View
                                                className={`h-5 w-5 rounded-full border-2 mr-2 ${isSelected ? 'border-primary' : 'border-gray-500'
                                                    } items-center justify-center`}
                                            >
                                                {isSelected && <View className="h-2.5 w-2.5 rounded-full bg-primary" />}
                                            </View>
                                            <Text className="text-base text-black">{t(opt.label)}</Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                            <CustomInput size={'sm'} value={formData.livoraLink} onChangeText={(text: string) => handleChange('livoraLink', text)} placeholder={t('Paste Link to 3d Livora here')} />
                            {errors.livoraLink && <Text className="text-red-500 text-sm">{errors.livoraLink}</Text>}
                            <TouchableOpacity onPress={pickImages} className='border-2 border-primaryHover border-dashed rounded-md py-4'>
                                <Feather name="upload-cloud" size={24} color="gray" className='text-center' />
                                <Text className='py-2'>
                                    <Text className='text-center text-primary'>{t("Upload Images & Videos")} </Text>
                                    <Text className='text-center '>{t("here")}</Text>
                                </Text>
                                <Text className='text-gray-400 text-center'>{t("Only .jpg, .png & .mp4")}</Text>
                            </TouchableOpacity>
                            <View className="flex flex-row flex-wrap gap-2 mt-4">
                                {files.map((uri, idx) => (
                                    <View key={idx} className="relative">
                                        <Image
                                            source={{ uri: uri.uri }}
                                            style={{ width: 100, height: 100, borderRadius: 8 }}
                                        />

                                        <TouchableOpacity
                                            onPress={() => {
                                                setFiles(prev => prev.filter((_, i) => i !== idx));
                                            }}
                                            className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow"
                                        >
                                            <Feather name="x" size={14} color="black" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                            <CustomButton text={t("SUBMIT")} onPress={handleMutation} />
                        </View>
                    </View>
                    {inputChange === '' ||
                        inputChange === 'Property Title' ||
                        inputChange === 'Size' ? null :
                        <BottomSheet
                            ref={bottomSheetRef}
                            enablePanDownToClose={true}
                            snapPoints={["30%", "50%"]}
                            onClose={() => setInputChange('')}
                        >
                            <BottomSheetView className="p-4">
                                {inputChange === "Property Type" ?
                                    <LocationTypes handleChange={handleChange} bottomSheetRef={bottomSheetRef} /> : inputChange === "Beds" ?
                                        <Beds handleChange={handleChange} bottomSheetRef={bottomSheetRef} /> : inputChange === "Baths" ?
                                            <Baths handleChange={handleChange} bottomSheetRef={bottomSheetRef} /> : inputChange === 'Facilities' ?
                                                <Facilities selectedFacilities={selectedFacilities} handleChange={handleChange} bottomSheetRef={bottomSheetRef} /> : inputChange === 'Location' ? <ChooseLocation handleChange={handleChange} bottomSheetRef={bottomSheetRef} /> : null}
                            </BottomSheetView>
                        </BottomSheet>}
                </ScrollView>
            </View>
        </GestureHandlerRootView>
    )
}

export default CreateProperties
