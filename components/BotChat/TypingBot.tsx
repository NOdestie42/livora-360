import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

const TypingDots = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    const animateDot = (dot: Animated.Value, delay: number) => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(dot, {
                    toValue: -5, // bounce up
                    duration: 300,
                    delay,
                    useNativeDriver: true,
                }),
                Animated.timing(dot, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    useEffect(() => {
        animateDot(dot1, 0);
        animateDot(dot2, 150);
        animateDot(dot3, 300);
    }, []);

    return (
        <View className="flex-row items-center justify-center gap-1">
            <Animated.View
                style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#555",
                    transform: [{ translateY: dot1 }],
                }}
            />
            <Animated.View
                style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#555",
                    transform: [{ translateY: dot2 }],
                }}
            />
            <Animated.View
                style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "#555",
                    transform: [{ translateY: dot3 }],
                }}
            />
        </View>
    );
};

export default TypingDots;
