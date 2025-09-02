import { getItemFromAsyncStorage } from "@/AsyncStorage";
import { ChatwithUserAlongPropertyData, ProperChattypes } from "@/types";
import instance from "@/utils/instance";

// Type definitions (add these to your types file)
interface FileObject {
    uri: string;
    type: string;
    name: string;
}

interface MessageSchemaPropsTypes {
    senderId?: string;
    receiverId?: string;
    propertyId?: string;
    message: {
        message?: string;
        file?: FileObject | string | null;
        mediaFile?: (FileObject | string)[];
    };
}


export const SendMessageMutateFunction = async (
    data: MessageSchemaPropsTypes
): Promise<MessageSchemaPropsTypes> => {
    const token = await getItemFromAsyncStorage('userToken');

    console.log('====================================');
    console.log('Sending data:', JSON.stringify(data, null, 2));
    console.log('====================================');

    const formData = new FormData();

    // Add required fields
    if (data.senderId) {
        formData.append("senderId", data.senderId);
    }
    if (data.receiverId) {
        formData.append("receiverId", data.receiverId);
    }
    if (data.propertyId) {
        formData.append("propertyId", data.propertyId);
    }

    // Add message (your backend expects this to be stringified)
    formData.append("message", JSON.stringify({
        message: data.message.message || ""
    }));

    // Handle voice file (single file) - matches backend's req.files["file"]
    if (data.message.file && data.message.file !== null) {
        console.log('Adding voice file:', data.message.file);

        if (typeof data.message.file === 'object' && data.message.file.uri) {
            formData.append("file", {
                uri: data.message.file.uri,
                type: data.message.file.type || 'audio/mp4',
                name: data.message.file.name || `audio_${Date.now()}.mp4`,
            } as any);
        }
    }

    // Handle media files (multiple images/videos) - matches backend's req.files["mediafiles"]
    if (data.message.mediaFile && Array.isArray(data.message.mediaFile) && data.message.mediaFile.length > 0) {
        console.log('Adding media files:', data.message.mediaFile);

        for (let i = 0; i < data.message.mediaFile.length; i++) {
            const mediaUri = data.message.mediaFile[i];

            // Since your frontend sends URI strings in the array
            if (typeof mediaUri === 'string') {
                const filename = mediaUri.split('/').pop() || `media_${Date.now()}_${i}`;
                const match = /\.(\w+)$/.exec(filename);
                let type = 'image/jpeg'; // default

                if (match) {
                    const ext = match[1].toLowerCase();
                    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
                        type = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
                    } else if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) {
                        type = `video/${ext}`;
                    }
                }

                formData.append('mediafiles', {
                    uri: mediaUri,
                    type: type,
                    name: filename,
                } as any);
            }
        }
    }

    try {
        const response = await instance.post<MessageSchemaPropsTypes>(
            "/sending-message",
            formData,
            {
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Send message error:', error);
        throw error;
    }
};



export const ChatWithUserAlongProperty = async (
    conversationId: string
) => {
    const token = await getItemFromAsyncStorage("userToken");
    const response = await instance.get<ChatwithUserAlongPropertyData>(
        `/chat-with-user-with-property/${conversationId}`,
        {
            headers: {
                Authorization: token,
            },
        }
    );
    return response.data;
};

export const ChatMainFunction = async (
    SendingId: string | null,
    RecievingId: string | null,
    conversationId: string | null
) => {
    const token = await getItemFromAsyncStorage('userToken');
    const response = await instance.get<ProperChattypes[]>(
        `/chat-with-user/${SendingId}/${RecievingId}/${conversationId}
    `,
        {
            headers: {
                Authorization: token,
            },
        }
    );
    return response.data;
};
