import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { Image, Platform, Pressable, Text, TextInput, View } from 'react-native';
import BackArrow from '../../assets/backArrow.svg';
import { MessageSchemaPropsTypes, UserData, SendMessageProps, FileItem } from '@/types';
import { getItemFromAsyncStorage } from '@/AsyncStorage';
import { MutationFunction, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChatWithUserAlongProperty, SendMessageMutateFunction } from './request';
import * as ImagePicker from 'expo-image-picker';
import { Audio, Video, ResizeMode } from 'expo-av';
import { io } from 'socket.io-client';
import Spinner from '../Spinner';
import Error from '../Error';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import MediaShow from './MediaShow';
import AudioVisualizer from './AudioWave';
import useListenMessages from './useListenMessages';
import FilePickSvg from '../../assets/filePick.svg';
import { FontAwesome } from '@expo/vector-icons';

const ChatComp = ({ id }: { id: string | string[] }) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const scrollViewRef = useRef<ScrollView>(null);
    const { t } = useTranslation();
    const [socket, setSocket] = useState<any>(null);
    const [storeId, setStoreId] = useState<string | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<UserData[]>([]);
    const [optionChoose, setOptionChoose] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState<Audio.Recording | null>(null);

    // Fixed files state structure to match backend expectations
    const [files, setFiles] = useState<{
        uri: string;  // Changed from 'url' to 'uri' for React Native compatibility
        name: string;
        type: string;
    }[]>([]);
    const [MessageInput, setMessageInput] = useState<SendMessageProps>({
        message: '',
        file: null,
        mediaFile: null,
    });

    useListenMessages(socket, storeId);
    const isDev = process.env.NODE_ENV === 'development';
    const WorkingModeLink = isDev
        ? Platform.OS === 'android'
            ? 'https://viste-backend-4daw3bsgpq-uc.a.run.app/'
            : 'http://localhost:8080'
        : 'https://viste-backend-4daw3bsgpq-uc.a.run.app/';

    useEffect(() => {
        (async () => {
            const id = await getItemFromAsyncStorage('userId');
            setStoreId(id);
        })();
    }, []);

    const {
        isLoading: ChatisLoading,
        isError: ChatisError,
        data: ChatData,
        error: Chaterror,
    } = useQuery({
        queryKey: ['chat-with-user-with-property', id],
        queryFn: () => ChatWithUserAlongProperty(id as string),
        enabled: !!id,
    });

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [ChatData?.messages?.length]);

    useEffect(() => {
        if (storeId) {
            const socketInstance = io(WorkingModeLink, {
                query: { userId: storeId },
            });
            socketInstance.on('connect', () => {
                console.log('Socket connected successfully');
            });
            socketInstance.on('connect_error', (error) => {
                console.log('Socket connection error:', error);
            });
            setSocket(socketInstance);

            socketInstance.on('getOnlineUsers', (users: UserData[]) => {
                setOnlineUsers(users);
            });

            return () => {
                socketInstance.close();
            };
        } else if (socket) {
            socket.close();
            setSocket(null);
        }
    }, [storeId]);

    useEffect(() => {
        if (socket) {
            socket.on('receiveMessage', (newMessage: { senderId: string; message: SendMessageProps }) => {
                queryClient.setQueryData(['chat-with-user-with-property', id], (oldData: any) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        messages: [
                            ...oldData.messages,
                            {
                                senderId: { _id: newMessage.senderId },
                                message: newMessage.message,
                                createdAt: new Date(),
                            },
                        ],
                    };
                });
            });

            return () => {
                socket.off('receiveMessage');
            };
        }
    }, [socket, queryClient, id]);

    const messageMutation = useMutation<any, Error, MessageSchemaPropsTypes>({
        mutationFn: SendMessageMutateFunction as MutationFunction<any, MessageSchemaPropsTypes>,
        onSuccess: async (data) => {
            queryClient.setQueryData(['chat-with-user-with-property', id], (oldData: any) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    messages: [...oldData.messages, data],
                };
            });
            queryClient.invalidateQueries({ queryKey: ['chat-with-user-with-property', id] });
            setMessageInput({
                file: null,
                message: '',
                mediaFile: null,
            });
            setFiles([]); // Clear files after sending
        },
        onError: (error: Error) => {
            console.log('Mutation error:', error);
        },
    });

    if (ChatisLoading) return <Spinner />;
    if (ChatisError) return <Error error={Chaterror} />;

    const notMe = ChatData?.participants.filter((participant) => participant._id !== storeId).map((data) => data);
    const isMePic = ChatData?.participants.filter((participant) => participant._id === storeId).map((data) => data);

    const requestPermissions = async () => {
        const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (mediaStatus !== 'granted' || cameraStatus !== 'granted') {
            alert(t('Permissions not granted. Please enable camera and media library access.'));
            return false;
        }
        return true;
    };

    const requestAudioPermissions = async () => {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== 'granted') {
            alert(t('Audio permission not granted. Please enable microphone access.'));
            return false;
        }
        return true;
    };

    const handleImagePicker = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8, // Reduced quality for better performance
        });

        if (!result.canceled) {
            const newFiles = result.assets.map((asset) => ({
                uri: asset.uri, // Use 'uri' instead of 'url'
                name: asset.fileName ?? `image_${Date.now()}.jpg`,
                type: asset.type ?? 'image/jpeg',
            }));

            setFiles((prev) => [...prev, ...newFiles]);
            setOptionChoose(false);
        }
    };

    const handleVideoPicker = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsMultipleSelection: true,
            quality: 0.8,
        });

        if (!result.canceled) {
            const newFiles = result.assets.map((asset) => ({
                uri: asset.uri, // Use 'uri' instead of 'url'
                name: asset.fileName ?? `video_${Date.now()}.mp4`,
                type: asset.type ?? 'video/mp4',
            }));

            setFiles((prev) => [...prev, ...newFiles]);
            setOptionChoose(false);
        }
    };

    const handleOpenCamera = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets?.[0]?.uri) {
            const asset = result.assets[0];
            const newFile = {
                uri: asset.uri, // Use 'uri' instead of 'url'
                name: asset.fileName ?? `capture_${Date.now()}.${asset.type === 'video' ? 'mp4' : 'jpg'}`,
                type: asset.type ?? (asset.type === 'video' ? 'video/mp4' : 'image/jpeg'),
            };

            setFiles((prev) => [...prev, newFile]);
            setOptionChoose(false);
        }
    };

    // Audio recording functions
    const startRecording = async () => {
        const hasPermission = await requestAudioPermissions();
        if (!hasPermission) return;

        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const newRecording = new Audio.Recording();
            const recordingOptions = {
                android: {
                    extension: '.m4a',
                    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
                    audioEncoder: Audio.AndroidAudioEncoder.AAC,
                    sampleRate: 44100,
                    numberOfChannels: 2,
                    bitRate: 128000,
                },
                ios: {
                    extension: '.m4a',
                    audioQuality: Audio.IOSAudioQuality.HIGH,
                    sampleRate: 44100,
                    numberOfChannels: 2,
                    bitRate: 128000,
                    linearPCMBitDepth: 16,
                    linearPCMIsBigEndian: false,
                    linearPCMIsFloat: false,
                },
                web: {
                    mimeType: 'audio/webm',
                    bitsPerSecond: 128000,
                },
            };
            await newRecording.prepareToRecordAsync(recordingOptions);
            await newRecording.startAsync();

            setRecording(newRecording);
            setIsRecording(true);
            setOptionChoose(false);
        } catch (error) {
            console.error('Failed to start recording:', error);
        }
    };

    const stopRecording = async () => {
        if (!recording) return;

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setIsRecording(false);
            setRecording(null);

            if (uri) {
                // Set the audio file in MessageInput for sending
                setMessageInput(prev => ({
                    ...prev,
                    file: {
                        uri: uri,
                        name: `audio_${Date.now()}.mp4`,
                        type: 'audio/mp4',
                    }
                }));
            }
        } catch (error) {
            console.error('Failed to stop recording:', error);
        }
    };

    const handleRemoveFile = (uri: string) => {
        setFiles((prev) => prev.filter((file) => file.uri !== uri));
    };

    const handleSubmit = () => {
        if (notMe) {
            // Fixed: Properly structure the message data for your backend
            const sendingMessage: MessageSchemaPropsTypes = {
                senderId: storeId,
                receiverId: notMe[0]._id,
                propertyId: ChatData?.propertyId._id,
                message: {
                    message: MessageInput.message,
                    // Send either voice file OR media files, not both
                    file: MessageInput.file, // Voice file
                    mediaFile: files.length > 0 ? files.map(f => f.uri) : null,
                },
            };

            // Socket emission (keep your existing structure)
            socket.emit('sendMessage', {
                senderId: storeId,
                receiverId: notMe[0]._id,
                message: {
                    message: MessageInput.message,
                    file: MessageInput.file,
                    mediaFile: files.length > 0 ? files : null,
                },
                user: isMePic?.[0],
            });

            // Only send if there's content
            if (MessageInput.message || files.length > 0 || MessageInput.file) {
                console.log('Sending message:', sendingMessage);
                messageMutation.mutate(sendingMessage);
            }
        }
    };




    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
                <Pressable onPress={() => router.push('/(tabs)/inbox')} className="mr-3">
                    <BackArrow width={22} height={22} />
                </Pressable>
                <Image
                    source={{ uri: notMe?.[0]?.profilePic }}
                    className="w-10 h-10 rounded-full mr-3"
                />
                <View>
                    <Text className="text-base font-semibold text-gray-900">
                        {notMe?.[0]?.firstName || 'Chat'}
                    </Text>
                    <Text className="text-xs text-green-600">
                        {onlineUsers.some((u) => u._id === notMe?.[0]?._id) ? 'Online' : 'Offline'}
                    </Text>
                </View>
            </View>

            {/* Messages */}
            <ScrollView
                ref={scrollViewRef}
                className="flex-1 px-4 py-2"
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            >
                {ChatData &&
                    ChatData.messages?.map((data, index) => {
                        const isMe = data.senderId._id === storeId;
                        const formattedTime = moment(data.createdAt).format('h:mm A');

                        return (
                            <View key={index} className={`mb-3 ${isMe ? 'items-end' : 'items-start'}`}>
                                <View
                                    className={`max-w-[80%] px-3 py-2 rounded-2xl shadow-sm ${isMe ? 'bg-blue-500 rounded-br-sm' : 'bg-white border border-gray-200 rounded-bl-sm'
                                        }`}
                                >
                                    {/* Text */}
                                    {data.message.message ? (
                                        <Text className={`text-sm ${isMe ? 'text-white' : 'text-gray-800'}`}>
                                            {data.message.message}
                                        </Text>
                                    ) : null}

                                    {/* Media Files (Images/Videos) */}
                                    {data.message.file && Array.isArray(data.message.file) && (
                                        <View className="mt-2 rounded-xl overflow-hidden">
                                            <MediaShow isMe={isMe} data={data} />
                                        </View>
                                    )}

                                    {/* Audio File (Single file object) */}

                                    {data.message?.file &&
                                        data.message?.file[0]?.type.includes("audio") && (
                                            <AudioVisualizer isMe={isMe} data={data} />
                                        )}

                                    {/* Time */}
                                    <Text
                                        className={`text-[10px] mt-1 self-end ${isMe ? 'text-blue-100' : 'text-gray-400'
                                            }`}
                                    >
                                        {formattedTime}
                                    </Text>
                                </View>
                            </View>
                        );
                    })}
            </ScrollView>

            {/* Input Bar */}
            <View className="px-3 py-2 bg-white border-t border-gray-200">
                {/* Image Previews */}
                {files.length > 0 && (
                    <ScrollView
                        horizontal
                        className="mb-2"
                        showsHorizontalScrollIndicator={false}
                    >
                        {files.map((file, index) => (
                            file.type.includes('image') && (
                                <View key={index} className="relative mr-2">
                                    <Image
                                        source={{ uri: file.uri }}
                                        className="w-16 h-16 rounded-md"
                                        resizeMode="cover"
                                    />
                                    <Pressable
                                        className="absolute top-0 right-0 bg-red-500 rounded-full w-5 h-5 items-center justify-center"
                                        onPress={() => handleRemoveFile(file.uri)}
                                    >
                                        <Text className="text-white text-xs">X</Text>
                                    </Pressable>
                                </View>
                            ),

                            file.type.includes('video') && (
                                <View key={index} className="relative mr-2">
                                    <View className="w-16 h-16 rounded-md items-center justify-center">
                                        <Video
                                            source={{ uri: file.uri }}
                                            style={{ width: "100%", height: "100%" }}
                                            useNativeControls
                                            resizeMode={ResizeMode.CONTAIN}
                                        />
                                    </View>
                                    <Pressable
                                        className="absolute top-0 right-0 bg-red-500 rounded-full w-5 h-5 items-center justify-center"
                                        onPress={() => handleRemoveFile(file.uri)}
                                    >
                                        <Text className="text-white text-xs">X</Text>
                                    </Pressable>
                                </View>
                            )
                        ))}
                    </ScrollView>
                )}

                {/* Voice Recording Indicator */}
                {isRecording && (
                    <View className="mb-2 bg-red-100 p-2 rounded-md">
                        <Text className="text-red-600 text-center">🔴 Recording... Tap microphone to stop</Text>
                    </View>
                )}

                {/* Audio File Preview */}
                {MessageInput.file && (
                    <View className="mb-2 bg-blue-100 p-2 rounded-md flex-row items-center justify-between">
                        <Text className="text-blue-600">🎤 Voice message ready</Text>
                        <Pressable onPress={() => setMessageInput(prev => ({ ...prev, file: null }))}>
                            <Text className="text-red-500 font-bold">X</Text>
                        </Pressable>
                    </View>
                )}

                {/* Options Menu */}
                {optionChoose && (
                    <View className="flex justify-evenly w-40 h-36 bg-white rounded-md absolute bottom-14 left-3 p-2 border border-gray-200 z-10">
                        <Pressable onPress={handleImagePicker} className="flex flex-row items-center gap-2">
                            <FontAwesome name="image" size={24} color="#0582CA" />
                            <Text>Image</Text>
                        </Pressable>
                        <Pressable onPress={handleVideoPicker} className="flex flex-row items-center gap-2">
                            <FontAwesome name="video-camera" size={24} color="#0582CA" />
                            <Text>Video</Text>
                        </Pressable>
                        <Pressable onPress={handleOpenCamera} className="flex flex-row items-center gap-2">
                            <FontAwesome name="camera" size={24} color="#0582CA" />
                            <Text>Camera</Text>
                        </Pressable>
                    </View>
                )}

                {/* Input and Buttons */}
                <View className="flex-row items-center relative">
                    <Pressable
                        className="mr-2"
                        onPress={() => setOptionChoose((prev) => !prev)}
                    >
                        <FilePickSvg width={24} height={24} />
                    </Pressable>

                    <TextInput
                        className="flex-1 bg-gray-100 px-3 py-2 rounded-full text-sm"
                        value={MessageInput.message}
                        onChangeText={(text) =>
                            setMessageInput((prev) => ({ ...prev, message: text }))
                        }
                        placeholder="Type a message..."
                        placeholderTextColor="#888"
                        returnKeyType="send"
                        onSubmitEditing={handleSubmit}
                    />

                    {(MessageInput.message || files.length > 0 || MessageInput.file) ? (
                        <Pressable
                            className="ml-2 bg-blue-500 px-4 py-2 rounded-full"
                            onPress={handleSubmit}
                            disabled={messageMutation.isPending}
                        >
                            <Text className="text-white font-semibold">
                                {messageMutation.isPending ? 'Sending...' : 'Send'}
                            </Text>
                        </Pressable>
                    ) : (
                        <Pressable
                            className={`ml-2 ${isRecording ? 'bg-red-500' : 'bg-gray-300'} p-2 rounded-full`}
                            onPress={isRecording ? stopRecording : startRecording}
                        >
                            <FontAwesome
                                name="microphone"
                                size={24}
                                color={isRecording ? "white" : "#0582CA"}
                            />
                        </Pressable>
                    )}
                </View>
            </View>
        </View>
    );
};

export default ChatComp;
