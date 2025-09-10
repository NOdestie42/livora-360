import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Audio } from "expo-av";

const useListenMessages = (socket: any, conversationId: string | null) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (socket) {
            socket.on("newMessage", async (newMessage: any) => {
                console.log("Received newMessage:", JSON.stringify(newMessage, null, 2));
                newMessage.shouldShake = true;

                // Play notification sound
                try {
                    const { sound } = await Audio.Sound.createAsync(
                        require("../../assets/notification.mp3") // Ensure you have a notification.mp3 in assets
                    );
                    await sound.playAsync();
                    sound.setOnPlaybackStatusUpdate((status) => {
                        if (status.isLoaded && status.didJustFinish) {
                            sound.unloadAsync();
                        }
                    });
                } catch (error) {
                    console.error("Error playing notification sound:", error);
                }

                // Update the chat messages in the query cache
                queryClient.setQueryData(
                    ["chat-with-user-with-property", conversationId],
                    (oldData: any) => {
                        if (!oldData) return oldData;
                        console.log("Updating cache with new message:", newMessage);
                        return {
                            ...oldData,
                            messages: [...oldData.messages, {
                                senderId: { _id: newMessage.senderId },
                                message: {
                                    message: newMessage.message.message || "",
                                    file: newMessage.message.file || null,
                                    mediaFile: newMessage.message.mediaFile || null,
                                },
                                createdAt: newMessage.createdAt || new Date(),
                                shouldShake: true,
                            }],
                        };
                    }
                );
            });

            return () => {
                socket.off("newMessage");
            };
        }
    }, [socket, queryClient, conversationId]);
};

export default useListenMessages;
