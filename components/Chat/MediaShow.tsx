import React from "react";
import { View, Image } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";

interface MediaShowProps {
    data: any;
    isMe: boolean;
}

const MediaShow: React.FC<MediaShowProps> = ({ data }) => {
    const files = data?.message?.file || [];

    return (
        <View className="w-full flex-col">
            {files.map((val: any, index: number) => {
                if (val.type.includes("video")) {
                    const player = useVideoPlayer(val.url, (player) => {
                        player.loop = true;
                    });

                    return (
                        <View key={index} className="mb-2">
                            <VideoView
                                player={player}
                                allowsFullscreen
                                allowsPictureInPicture
                                nativeControls
                                style={{ width: 224, height: 224, borderRadius: 12 }}
                            />
                        </View>
                    );
                }

                if (val.type.includes("image")) {
                    return (
                        <View key={index} className="mb-2">
                            <Image
                                source={{ uri: val.url }}
                                className="w-56 h-56 rounded-xl"
                                resizeMode="cover"
                            />
                        </View>
                    );
                }

                return null;
            })}
        </View>
    );
};

export default MediaShow;
