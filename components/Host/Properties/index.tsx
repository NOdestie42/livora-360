import { View, Text, Image, Pressable, TouchableOpacity, Animated, ScrollView } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import { useRouter } from 'expo-router';
import { useQueries } from '@tanstack/react-query';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import RoundedBell from "../../../assets/roundedBell.svg";
import Propertie from "../../../assets/propertie.svg";
import Locations from '../../../assets/location.svg'
import Star from '../../../assets/yellowStar.svg'
import VerticalThreeDot from '../../../assets/verticalThreeDot.svg'
import RoundedPlus from '../../../assets/roundedPlus.svg'
import CrossSvg from "../../../assets/cross.svg";
import Line_pensil from '../../../assets/line_pensil.svg';
import DeleteBin from '../../../assets/deletes.svg';
import Eye from '../../../assets/blue_eye.svg';

import CustomButton from '@/components/CustomButton';
import Spinner from '@/components/Spinner';
import Error from '@/components/Error';
import PropertyWithAi from './PropertyWithAi';
import { fetchAllProperties, fetchProfile } from './request';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '@/utils/CurrencyContext';


// ----------------- Hooks -----------------
const useScaleAnimation = () => {
    const scaleValue = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleValue, { toValue: 2, useNativeDriver: true }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleValue, { toValue: 1, useNativeDriver: true }).start();
    };

    return { scaleValue, handlePressIn, handlePressOut };
};

// ----------------- BottomSheet Wrapper -----------------
const CustomBottomSheet = ({
    innerRef,
    isOpen,
    onClose,
    snapPoints,
    onChange,
    children
}: any) => {
    if (!isOpen) return null;

    return (
        <View className="absolute inset-0 z-30">
            <GestureHandlerRootView className="flex-1">
                <BottomSheet
                    ref={innerRef}
                    snapPoints={snapPoints}
                    enablePanDownToClose
                    onClose={onClose}
                    onChange={onChange}
                    animationConfigs={{ duration: 400 }}
                    handleIndicatorStyle={{ display: "none" }}
                    backgroundStyle={{ backgroundColor: "white", borderRadius: 15 }}
                    index={isOpen ? 1 : 0}
                >
                    <BottomSheetView className="flex-1 h-full px-6">
                        {children}
                    </BottomSheetView>
                </BottomSheet>
            </GestureHandlerRootView>
        </View>
    );
};

// ----------------- Property Card -----------------
const PropertyCard = ({ item, onThreeDotPress, formatPrice }: any) => (
    <View className='pt-4 my-1' >
        <View className="flex-row items-center gap-4">
            <Image
                source={{ uri: item.files[0] }}
                style={{ width: 130, height: 70, borderRadius: 10 }}
            />
            <View className="flex-1">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-1">
                        <Locations />
                        <Text className="text-gray-700">{item.title}</Text>
                    </View>
                    <Pressable className="px-2 py-1 rounded-md active:bg-slate-200" onPress={() => onThreeDotPress(item._id)}>
                        <VerticalThreeDot />
                    </Pressable>
                </View>
                <Text className="text-xl font-semibold">{item.type}</Text>
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Text className="font-semibold text-primary">{formatPrice(item.rent)}</Text>
                        <Text className="text-secondary">/Night</Text>
                    </View>
                    <View className="flex flex-row items-center gap-1">
                        <Star />
                        <Text className="text-yellow-500 font-semibold">4.3</Text>
                        <Text className="text-gray-800">(32)</Text>
                    </View>
                </View>
            </View>
        </View>
    </View >
);

// ----------------- Empty State -----------------
const EmptyProperties = () => (
    <View className='h-[90vh] flex items-center justify-center'>
        <View className='p-4 rounded-md shadow'>
            <Propertie />
            <View className='flex flex-col gap-3 mt-4'>
                <Text className='font-semibold text-2xl text-center'>Add Rental Property</Text>
                <Text className='text-center'>
                    Easily add rental properties with details like type, location, price, and amenities for efficient listing management.
                </Text>
                <CustomButton text={'Add Property'} />
            </View>
        </View>
    </View>
);

// ----------------- Main Component -----------------
const HostPropertiesComp = () => {
    const router = useRouter();
    const [isAiSheetOpen, setIsAiSheetOpen] = useState(false);
    const [isPropertySheetOpen, setIsPropertySheetOpen] = useState(false);
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
    const { t } = useTranslation()
    const { formatPrice } = useCurrency()
    const aiBottomSheetRef = useRef<BottomSheet>(null);
    const propertyBottomSheetRef = useRef<BottomSheet>(null);

    const [{ data: properties, isPending, isError, error }, { data: profile, isPending: profilePending, isError: profileError, error: profileErr }] =
        useQueries({
            queries: [
                { queryKey: ["host-properties"], queryFn: fetchAllProperties },
                { queryKey: ["profile"], queryFn: fetchProfile }
            ]
        });

    const { scaleValue, handlePressIn, handlePressOut } = useScaleAnimation();

    // BottomSheet Handlers
    const openPropertySheet = (id: string) => {
        setSelectedPropertyId(id);
        setIsPropertySheetOpen(true);
        propertyBottomSheetRef.current?.snapToIndex(1);
    };

    if (isPending || profilePending) return <Spinner />;
    if (isError || profileError) return <Error error={error || profileErr} />;

    const propertyDetailsOptions = [
        { icon: <Eye />, text: 'Preview', action: () => router.push(`/3d-details/${selectedPropertyId}`) },
        { icon: <Line_pensil />, text: 'Edit', action: () => console.log("Edit clicked") },
        { icon: <DeleteBin />, text: 'Delete', action: () => console.log("Delete clicked") },
    ];

    return (
        <View className="flex-1 bg-white relative">
            {/* Header */}
            <View className="w-[90%] mx-auto mt-6">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                        <Image
                            source={profile?.profilePic ? { uri: profile.profilePic } : require('../../../assets/defaultPic.jpg')}
                            style={{ width: 50, height: 50, borderRadius: 50 }}
                        />
                        <View>
                            <Text className="font-extrabold text-2xl">{t("Hi")} {profile?.firstName}</Text>
                            <Text className="font-bold text-primary">{t("Welcome")} 👋</Text>
                        </View>
                    </View>
                    <Pressable onPress={() => router.push("/notification")}>
                        <RoundedBell width={40} height={40} />
                    </Pressable>
                </View>
            </View>

            {/* Properties Scrollable List */}
            <ScrollView
                contentContainerStyle={{ paddingBottom: 120 }} // extra bottom space for buttons
                showsVerticalScrollIndicator={false}
                className="w-[90%] mx-auto"
            >
                <Text className="text-2xl font-semibold mb-1 mt-4">{t("MyProperties")}</Text>
                {properties?.length > 0
                    ? properties.map((item: any, i: number) => (
                        <PropertyCard
                            formatPrice={formatPrice}
                            key={i}
                            item={item}
                            onThreeDotPress={openPropertySheet}
                        />
                    ))
                    : <EmptyProperties />}
            </ScrollView>

            {/* Bottom buttons */}
            <View className="absolute bottom-2 pl-5 w-full flex-row justify-between items-center">
                <View />
                <Pressable onPress={() => router.push('/host/addproperty')}>
                    <TouchableOpacity
                        activeOpacity={1}
                        onLongPress={() => { handlePressIn(); setIsAiSheetOpen(true); aiBottomSheetRef.current?.snapToIndex(1); }}
                        onPressOut={handlePressOut}
                    >
                        <Animated.View style={{ transform: [{ scale: scaleValue }], width: 56, height: 56 }}>
                            <Image source={require("../../../assets/images/ai.png")} style={{ width: "100%", height: "100%" }} />
                        </Animated.View>
                    </TouchableOpacity>
                </Pressable>
                <Pressable onPress={() => router.push('/host/addproperty')}>
                    <View className="w-12 h-12 mr-6 bg-primary rounded-full flex items-center justify-center">
                        <RoundedPlus width={28} height={28} />
                    </View>
                </Pressable>
            </View>

            {/* AI BottomSheet */}
            <CustomBottomSheet
                innerRef={aiBottomSheetRef}
                isOpen={isAiSheetOpen}
                onClose={() => setIsAiSheetOpen(false)}
                snapPoints={["1%", "90%"]}
                onChange={(i: number) => i === 0 && setIsAiSheetOpen(false)}
            >
                <View className="flex-row items-center justify-between px-3 py-1">
                    <Text className="text-primary font-semibold text-xl">LIVAI</Text>
                    <Pressable onPress={() => setIsAiSheetOpen(false)}>
                        <CrossSvg width={16} height={16} />
                    </Pressable>
                </View>
                <PropertyWithAi />
            </CustomBottomSheet>

            {/* Property BottomSheet */}
            <CustomBottomSheet
                innerRef={propertyBottomSheetRef}
                isOpen={isPropertySheetOpen}
                onClose={() => { setIsPropertySheetOpen(false); setSelectedPropertyId(null); }}
                snapPoints={["1%", "30%"]}
                onChange={(i: number) => i === 0 && setIsPropertySheetOpen(false)}
            >
                <View className="px-4 py-2 flex-col gap-4">
                    {propertyDetailsOptions.map((opt, i) => (
                        <Pressable
                            key={i}
                            onPress={opt.action}
                            className="flex-row items-center gap-4 py-3 border-b border-gray-200 last:border-0 active:opacity-70"
                        >
                            <View className="w-6 h-6">{opt.icon}</View>
                            <Text className="text-base font-medium text-gray-800 flex-1">{t(opt.text)}</Text>
                        </Pressable>
                    ))}
                </View>
            </CustomBottomSheet>
        </View>
    );
};

export default HostPropertiesComp;
