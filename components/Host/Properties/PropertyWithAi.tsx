import { useUserContext } from '@/utils/UserAiBookingContext';
import { useRouter } from 'expo-router';
import React, { useRef, useState, useEffect } from 'react';
import { Pressable, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface ChatMessage {
    sender: 'AI' | 'User';
    message: string;
}

const PropertyWithAi = () => {
    const [userInput, setUserInput] = useState<string>('');
    const [isAITyping, setIsAITyping] = useState<boolean>(false);
    const textInputRef = useRef<TextInput>(null);
    const scrollViewRef = useRef<ScrollView>(null);
    const { updateUserAnswers } = useUserContext();
    const router = useRouter();

    const [conversation, setConversation] = useState<ChatMessage[]>([
        {
            sender: 'AI',
            message:
                "Hi! I'm your AI assistant to help you list a new property. 😊 Let's make this fun! What's the name of your property?",
        },
    ]);
    const [step, setStep] = useState<number>(1);

    const propertyTypes = ['House', 'Apartment', 'Guesthouse', 'Hotel'];
    const bedsTypes = [1, 2, 4, 6, 8];
    const bathTypes = [1, 2, 4, 6, 8];

    // Auto-scroll to the latest message
    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [conversation]);

    const handleSendMessage = async () => {
        if (!userInput.trim()) return;

        // Add user message to conversation
        setConversation((prev) => [
            ...prev,
            { sender: 'User', message: userInput.trim() },
        ]);

        // Simulate AI typing
        setIsAITyping(true);
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate thinking delay

        if (step === 1) {
            updateUserAnswers({ propertyName: userInput.trim() });
            setConversation((prev) => [
                ...prev,
                {
                    sender: 'AI',
                    message: `Nice! "${userInput.trim()}" sounds great. 🏡 What's the property type? Pick one: ${propertyTypes.join(
                        ', '
                    )}.`,
                },
            ]);
            setStep(2);
        } else if (step === 2) {
            const validType = propertyTypes.find(
                (type) => type.toLowerCase() === userInput.trim().toLowerCase()
            );
            if (validType) {
                updateUserAnswers({ propertyType: validType });
                setConversation((prev) => [
                    ...prev,
                    { sender: 'AI', message: `Awesome, ${validType} it is! 🎉` },
                    {
                        sender: 'AI',
                        message: `How many beds does ${validType.toLowerCase()} have? Choose from: ${bedsTypes.join(
                            ', '
                        )}.`,
                    },
                ]);
                setStep(3);
            } else {
                setConversation((prev) => [
                    ...prev,
                    {
                        sender: 'AI',
                        message: `Oops! I need a valid property type. Try one of these: ${propertyTypes.join(
                            ', '
                        )}. 😊`,
                    },
                ]);
            }
        } else if (step === 3) {
            const validBeds = bedsTypes.includes(Number(userInput.trim()));
            if (validBeds) {
                updateUserAnswers({ beds: Number(userInput.trim()) });
                setConversation((prev) => [
                    ...prev,
                    { sender: 'AI', message: `Got it, ${userInput.trim()} beds! 🛏️` },
                    {
                        sender: 'AI',
                        message: `How many bathrooms are there? Pick from: ${bathTypes.join(
                            ', '
                        )}.`,
                    },
                ]);
                setStep(4);
            } else {
                setConversation((prev) => [
                    ...prev,
                    {
                        sender: 'AI',
                        message: `Hmm, please pick a valid number of beds: ${bedsTypes.join(
                            ', '
                        )}. Let's try again! 😄`,
                    },
                ]);
            }
        } else if (step === 4) {
            const validBaths = bathTypes.includes(Number(userInput.trim()));
            if (validBaths) {
                updateUserAnswers({ baths: Number(userInput.trim()) });
                setConversation((prev) => [
                    ...prev,
                    { sender: 'AI', message: `${userInput.trim()} bathrooms, perfect! 🚿` },
                    {
                        sender: 'AI',
                        message: `What's the nightly rental rate for this property? (e.g., 100 for $100/night)`,
                    },
                ]);
                setStep(5);
            } else {
                setConversation((prev) => [
                    ...prev,
                    {
                        sender: 'AI',
                        message: `Please choose a valid number of bathrooms: ${bathTypes.join(
                            ', '
                        )}. Try again! 😊`,
                    },
                ]);
            }
        } else if (step === 5) {
            const validRate =
                !isNaN(Number(userInput.trim())) && Number(userInput.trim()) > 0;
            if (validRate) {
                updateUserAnswers({ rentalRate: Number(userInput.trim()) });
                setConversation((prev) => [
                    ...prev,
                    {
                        sender: 'AI',
                        message: `Sweet! The rental rate is $${userInput.trim()}/night. 💰`,
                    },
                    {
                        sender: 'AI',
                        message: `How many guests can stay in this property? (e.g., 4 for up to 4 guests)`,
                    },
                ]);
                setStep(6);
            } else {
                setConversation((prev) => [
                    ...prev,
                    {
                        sender: 'AI',
                        message:
                            'Please enter a valid rental rate (a positive number, like 100). Let’s try that again! 😄',
                    },
                ]);
            }
        } else if (step === 6) {
            const validPersons =
                !isNaN(Number(userInput.trim())) && Number(userInput.trim()) > 0;
            if (validPersons) {
                updateUserAnswers({ maxPersons: Number(userInput.trim()) });
                setConversation((prev) => [
                    ...prev,
                    {
                        sender: 'AI',
                        message: `Great, up to ${userInput.trim()} guests can stay! 🧑‍🤝‍🧑`,
                    },
                    {
                        sender: 'AI',
                        message: `What is the size of the property in square feet or meters? (e.g., 1200 for 1200 sq ft)`,
                    },
                ]);
                setStep(7);
            } else {
                setConversation((prev) => [
                    ...prev,
                    {
                        sender: 'AI',
                        message:
                            'Please enter a valid number of guests (a positive number, like 4). Try again! 😊',
                    },
                ]);
            }
        } else if (step === 7) {
            const validSize =
                !isNaN(Number(userInput.trim())) && Number(userInput.trim()) > 0;
            if (validSize) {
                updateUserAnswers({ size: Number(userInput.trim()) });
                setConversation((prev) => [
                    ...prev,
                    {
                        sender: 'AI',
                        message: `Awesome, the property is ${userInput.trim()} square feet! 📏`,
                    },
                    {
                        sender: 'AI',
                        message:
                            "Woohoo! Your property is all set. Let's finalize the details! 🚀",
                    },
                ]);
                setStep(8);
                // Navigate to the next page after a slight delay for a smoother UX
                setTimeout(() => router.push('/host/addproperty'), 1000);
            } else {
                setConversation((prev) => [
                    ...prev,
                    {
                        sender: 'AI',
                        message:
                            'Please enter a valid size for the property (a positive number, like 1200). Try again! 😊',
                    },
                ]);
            }
        }

        setIsAITyping(false);
        setUserInput(''); // Clear input field
        textInputRef.current?.focus(); // Refocus input
    };

    // Handle suggestion button presses
    const handleSuggestionPress = (value: string) => {
        setUserInput(value);
        handleSendMessage();
    };

    // Render suggestion buttons based on the current step
    const renderSuggestions = () => {
        if (step === 2) {
            return propertyTypes.map((type) => (
                <Pressable
                    key={type}
                    className="bg-blue-100 px-3 py-1 rounded-full mr-2 mb-2"
                    onPress={() => handleSuggestionPress(type)}
                >
                    <Text className="text-blue-600 font-semibold">{type}</Text>
                </Pressable>
            ));
        } else if (step === 3 || step === 4) {
            const options = step === 3 ? bedsTypes : bathTypes;
            return options.map((num) => (
                <Pressable
                    key={num}
                    className="bg-blue-100 px-3 py-1 rounded-full mr-2 mb-2"
                    onPress={() => handleSuggestionPress(num.toString())}
                >
                    <Text className="text-blue-600 font-semibold">{num}</Text>
                </Pressable>
            ));
        }
        return null;
    };

    return (
        <View className="flex-1">
            <ScrollView
                ref={scrollViewRef}
                className="flex-1 py-2"
                keyboardShouldPersistTaps="handled"
            >
                {conversation.map((chat, index) => (
                    <Animated.View
                        key={index}
                        entering={FadeIn}
                        exiting={FadeOut}
                        className={`mb-3 p-3 rounded-lg max-w-[80%] ${chat.sender === 'User' ? 'bg-blue-500 self-end' : 'bg-gray-200 self-start'
                            } shadow-sm`}
                    >
                        <Text
                            className={`${chat.sender === 'User' ? 'text-white' : 'text-gray-800'} text-base`}
                        >
                            {chat.message}
                        </Text>
                    </Animated.View>
                ))}
                {isAITyping && (
                    <View className="mb-3 p-3 rounded-lg max-w-[80%] bg-gray-200 self-start flex-row items-center">
                        <ActivityIndicator size="small" color="#2563eb" />
                        <Text className="text-gray-600 ml-2">AI is typing...</Text>
                    </View>
                )}
            </ScrollView>
            <View className="p-4 border-t border-gray-200 bg-white">
                <View className="flex flex-row flex-wrap mb-2">{renderSuggestions()}</View>
                <View className="flex flex-row items-center gap-2">
                    <TextInput
                        ref={textInputRef}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 bg-white shadow-sm"
                        value={userInput}
                        onChangeText={setUserInput}
                        placeholder="Type your response..."
                        returnKeyType="send"
                        onSubmitEditing={handleSendMessage}
                    // autoFocus
                    />
                    <Pressable
                        className="bg-blue-500 px-5 py-3 rounded-lg"
                        onPress={handleSendMessage}
                    >
                        <Text className="text-white font-semibold text-base">Send</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
};

export default PropertyWithAi;
