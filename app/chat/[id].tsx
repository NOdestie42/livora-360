import React from 'react'
import ChatComp from '@/components/Chat';
import { useLocalSearchParams } from 'expo-router';

const Chat = () => {
    const { id } = useLocalSearchParams();
    return (
        <ChatComp id={id} />
    )
}

export default Chat
