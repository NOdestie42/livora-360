import { getItemFromAsyncStorage } from '@/AsyncStorage';
import { initSocket } from '@/utils/socket';
import React, { useState, useRef, useEffect } from 'react';
import { Pressable, Text, TextInput, View, Image, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import TypingDots from './TypingBot';

const BotChat = () => {
    const scrollViewRef = useRef<ScrollView>(null);
    const [loading, setLoading] = useState(false)
    const [messages, setMessages] = useState<
        {
            message: {
                message: string;
                data: any[] | null;
                singleProperty: any | null;
            };
            user: string;
        }[]
    >([
        {
            message: { message: "Hi, how can I help?", data: null, singleProperty: null },
            user: "bot",
        },
    ]);
    const [inputText, setInputText] = useState('');
    const [partialMessage, setPartialMessage] = useState('');
    const textInputRef = useRef<TextInput>(null);
    const socketRef = useRef<any>(null);

    useEffect(() => {
        let socket: any;

        const setupSocket = async () => {
            try {
                socket = await initSocket();
                socketRef.current = socket;

                socket.on("connect", () => {
                    console.log("✅ Connected to socket:", socket.id);
                });

                socket.on("disconnect", () => {
                    console.log("❌ Disconnected");
                });

                // 👇 Match backend event exactly like web
                socket.on("receiveMessage", (data: {
                    message: { message: string; data: any[]; singleProperty: any };
                    user: string;
                }) => {
                    let message = data.message;
                    setLoading(false)
                    let currentIndex = -1;

                    const streamMessage = () => {
                        if (currentIndex < message.message.length) {
                            setPartialMessage(prev => prev + message.message.charAt(currentIndex));
                            currentIndex++;
                            setTimeout(streamMessage, 5);
                        } else {
                            setMessages(prev => [
                                ...prev,
                                { message: message, user: data.user },
                            ]);
                            setPartialMessage("");
                        }
                    };

                    streamMessage();
                });
            } catch (err) {
                console.error("⚠️ Socket setup failed:", err);
            }
        };

        setupSocket();

        return () => {
            if (socket) {
                socket.off("connect");
                socket.off("disconnect");
                socket.off("receiveMessage");
                socket.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages, partialMessage]);

    const handleSend = async () => {
        setLoading(true)
        if (!inputText.trim() || !socketRef.current) return;
        const userId = await getItemFromAsyncStorage("userId");

        socketRef.current.emit("sendMessage", {
            senderId: userId,
            message: inputText,
            user: "me",
        });

        // push user msg into messages
        setMessages(prev => [
            ...prev,
            { message: { message: inputText, data: null, singleProperty: null }, user: "You" },
        ]);

        setInputText('');
        textInputRef.current?.clear();
    };

    return (
        <View className="flex-1 bg-white">
            <ScrollView ref={scrollViewRef} className="flex-1 px-4" keyboardShouldPersistTaps="handled">
                {messages.map((msg, idx) => (
                    <View
                        key={idx}
                        className={`mb-2 p-2 rounded-lg max-w-[80%] ${msg.user === "You" ? "bg-blue-500 self-end" : "bg-gray-200 self-start"
                            }`}
                    >
                        <Text className={msg.user === "You" ? "text-white" : "text-black"}>
                            {msg.message.message}
                        </Text>

                        {/* show property cards if available */}
                        {msg.message.data &&
                            msg.message.data.map((prop, i) => (
                                <View key={i} className="mt-2 p-2 bg-white rounded-md shadow">
                                    <Text>{i + 1}: {prop.title}</Text>
                                    <Text>${prop.rent}/Night</Text>
                                    {prop.files?.[0] && (
                                        <Image
                                            source={{ uri: prop.files[0] }}
                                            className="w-full h-32 rounded-md mt-2"
                                        />
                                    )}
                                </View>
                            ))}

                        {msg.message.singleProperty && (
                            <View className="mt-2 p-2 bg-white rounded-md shadow">
                                <Text>Title: {msg.message.singleProperty.title}</Text>
                                <Text>Rent: ${msg.message.singleProperty.rent}</Text>
                                <Text>Beds: {msg.message.singleProperty.beds}</Text>
                            </View>
                        )}
                    </View>
                ))}

                {loading && <View className="self-start px-4 py-3 rounded-md">
                    <TypingDots />
                </View>}


                {/* streaming bot text */}
                {partialMessage.length > 0 && (
                    <View className="mb-2 p-2 rounded-lg bg-gray-200 self-start max-w-[80%]">
                        <Text className="text-black">{partialMessage}</Text>
                    </View>
                )}
            </ScrollView>

            <View className="flex flex-row items-center gap-2 p-4 border-t border-gray-200">
                <TextInput
                    ref={textInputRef}
                    className="flex-1 border border-gray-300 rounded-md pl-3 py-2"
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type a message..."
                    returnKeyType="send"
                    onSubmitEditing={handleSend}
                />
                <Pressable className="bg-blue-500 px-4 py-2 rounded-md" onPress={handleSend}>
                    <Text className="text-white font-semibold">Send</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default BotChat;
