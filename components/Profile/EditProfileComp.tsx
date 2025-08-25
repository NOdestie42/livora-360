import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import BackArrow from '../../assets/backArrow.svg';
import { ActivityIndicator, Image, Pressable, Text, TextInput, View } from 'react-native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchProfile, LoginResponse, UpdateData, UpdateImage, updateUser } from './request';
import Toast from 'react-native-toast-message';
import CustomInput from '../CustomInput';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '../CustomButton';
import { useTranslation } from 'react-i18next';


const EditProfileComp = () => {
    const router = useRouter();
    const queryCLient = useQueryClient();
    const { t } = useTranslation()
    const [firstName, setFirstName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [bio, setbio] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false);
    const [imageLoading, setImageLoading] = useState<boolean>(false);

    const { isLoading, isError, data, error, isSuccess } = useQuery({
        queryKey: ["profile"],
        queryFn: fetchProfile,
    });

    const mutationImage = useMutation<LoginResponse, Error, FormData>({
        mutationFn: UpdateImage,
        onMutate: () => {
            setImageLoading(true);
        },
        onSuccess: () => {
            setImageLoading(false);
            queryCLient.invalidateQueries({ queryKey: ['profile', 'whoami'] });
            Toast.show({
                type: "success",
                text1: "Image edited successfully",
            });
        },
        onError: (err) => {
            setImageLoading(false);
            Toast.show({
                type: "error",
                text1: "Error updating image",
                text2: `Error: ${err}`
            });
        }
    })

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];

            const formData = new FormData();
            formData.append("files", {
                uri: asset.uri,
                name: "profile.jpg",
                type: "image/jpeg",
            } as any);

            mutationImage.mutate(formData);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            setFirstName(data.firstName);
            setEmail(data.email);
        }
    }, [isSuccess]);

    const mutation = useMutation<LoginResponse, Error, UpdateData>({
        mutationFn: updateUser,
        onMutate: () => {
            setLoading(true);
        },
        onSuccess: () => {
            setLoading(false);
            queryCLient.invalidateQueries({ queryKey: ['profile', "whoami"] });
            Toast.show({
                type: "success",
                text1: "Edit successfully",
            });
        },
        onError: (err) => {
            setLoading(false);
            Toast.show({
                type: "error",
                text1: "Error updating image",
                text2: `Error: ${err}`
            });
        }
    })

    const handleSubmit = () => {
        mutation.mutate({ firstName, email, bio });
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#0582CA" />
                <Text>Loading...</Text>
            </View>
        );
    }

    if (isError) {
        return <Text>Error: {error.message}</Text>;
    }

    return (
        <View className="flex-1 bg-white">
            <View className="w-[90%] mx-auto mt-6">
                {/* Back Button */}
                <Pressable onPress={() => router.back()}>
                    <BackArrow />
                </Pressable>

                <Text className="text-[28px] font-semibold py-4">{t("Edit Profile")}</Text>

                {/* Profile Image */}
                <View className='flex flex-row items-center justify-center'>
                    <Pressable onPress={pickImage} className='relative'>
                        <Image
                            source={{ uri: data?.profilePic }}
                            className="w-20 h-20 rounded-full"
                        />
                        {imageLoading && (
                            <View className="absolute inset-0 bg-black/40 rounded-full flex justify-center items-center">
                                <ActivityIndicator color="#fff" />
                            </View>
                        )}
                        <Text className='absolute -bottom-1 bg-primary text-white px-2 py-1 text-xs -right-1 rounded-full shadow-md'>
                            {t("Edit")}
                        </Text>
                    </Pressable>
                </View>

                {/* Form */}
                <View className='pt-4 flex gap-6'>
                    <CustomInput
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder={t('Enter Name')}
                    />
                    <CustomInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder={t('Enter Email')}
                    />
                    <TextInput
                        multiline
                        numberOfLines={5}
                        className='px-3 rounded-md text-[16px] w-full py-3 text-textPrimary border-[#E0E0E0] border-b-2 focus:border-primary'
                        placeholder={t('Overview')}
                        placeholderTextColor={'#999999'}
                        value={bio}
                        onChangeText={setbio}
                    />
                    <CustomButton text={loading ? `${t('SAVING')}...` : t("SUBMIT")} onPress={handleSubmit} />
                </View>
            </View>
        </View>
    )
}

export default EditProfileComp
