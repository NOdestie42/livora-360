import React, { useEffect, useState, useRef } from "react";
import {
    View,
    TouchableOpacity,
    Animated,
    Text,
    Pressable,
    LayoutChangeEvent,
} from "react-native";
import { Audio, AVPlaybackStatus } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import { ProperChattypes } from "@/types";

type AudioVisualizerProps = {
    data: ProperChattypes;
    isMe: boolean;
};

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ data, isMe }) => {
    const audioUrl = data?.message?.file?.[0]?.url ?? null;

    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [barWidth, setBarWidth] = useState(180); // actual width of progress bar

    const progressAnimation = useRef(new Animated.Value(0)).current;

    // Update progress bar
    const updateProgress = (status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;

        if (status.durationMillis != null) {
            setPosition(status.positionMillis ?? 0);
            setDuration(status.durationMillis);

            const progress =
                (status.positionMillis / status.durationMillis) * barWidth;
            progressAnimation.setValue(progress);
        }

        if (status.didJustFinish) {
            setIsPlaying(false);
            progressAnimation.setValue(0);
            setPosition(0);
            sound?.setPositionAsync(0);
        }
    };

    // Load and play audio
    useEffect(() => {
        if (!audioUrl) return;

        let mounted = true;
        const loadAudio = async () => {
            try {
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: audioUrl },
                    { shouldPlay: false, progressUpdateIntervalMillis: 100 }
                );

                if (!mounted) return;

                newSound.setOnPlaybackStatusUpdate(updateProgress);
                setSound(newSound);
            } catch (error) {
                console.log("Error loading audio:", error);
            }
        };

        loadAudio();

        return () => {
            mounted = false;
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [audioUrl]);

    // Toggle play/pause
    const togglePauseResume = async () => {
        if (!sound) return;

        try {
            if (isPlaying) {
                await sound.pauseAsync();
                setIsPlaying(false);
            } else {
                await sound.playAsync();
                setIsPlaying(true);
            }
        } catch (error) {
            console.error("Error toggling audio:", error);
        }
    };

    // Seek when user taps progress bar
    const handleSeek = async (evt: any) => {
        if (!sound || duration === 0) return;

        const touchX = evt.nativeEvent.locationX;
        const clampedX = Math.max(0, Math.min(touchX, barWidth));

        const seekMillis = (clampedX / barWidth) * duration;
        try {
            await sound.setPositionAsync(seekMillis);
            progressAnimation.setValue(clampedX);
            setPosition(seekMillis);
        } catch (error) {
            console.log("Error seeking audio:", error);
        }
    };

    // Get actual bar width from layout
    const onBarLayout = (e: LayoutChangeEvent) => {
        setBarWidth(e.nativeEvent.layout.width);
    };

    // Format time (mm:ss)
    const formatTime = (millis: number): string => {
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    if (!audioUrl) {
        return (
            <View className="p-2">
                <Text className={isMe ? "text-white" : "text-black"}>
                    No audio file available.
                </Text>
            </View>
        );
    }

    return (
        <View className="flex-row items-end p-2">
            <TouchableOpacity onPress={togglePauseResume}>
                <MaterialIcons
                    name={isPlaying ? "pause" : "play-arrow"}
                    size={26}
                    color={isMe ? "#ffffff" : "#000000"}
                />
            </TouchableOpacity>
            <View className="ml-2">
                <Pressable onPress={handleSeek} onLayout={onBarLayout}>
                    <View className="w-[180px] h-1 bg-gray-300 rounded">
                        <View
                            className={`h-1 rounded ${isMe ? "bg-white/30" : "bg-gray-400"}`}
                        />
                        <Animated.View
                            className={`w-3 h-3 rounded-full absolute -top-1 ${isMe ? "bg-white" : "bg-primary"
                                }`}
                            style={{ transform: [{ translateX: progressAnimation }] }}
                        />
                    </View>
                </Pressable>
                <View className="flex-row justify-between mt-1">
                    <Text className={`text-xs ${isMe ? "text-white" : "text-black"}`}>
                        {formatTime(position)}
                    </Text>
                    <Text className={`text-xs ${isMe ? "text-white" : "text-black"}`}>
                        {formatTime(duration)}
                    </Text>
                </View>
            </View>
        </View>
    );
};

export default AudioVisualizer;
