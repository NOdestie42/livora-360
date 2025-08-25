import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import BackArrow from "../../assets/backArrow.svg";
import CustomButton from "@/components/CustomButton";
import CustomInput from "@/components/CustomInput";
import Toast from "react-native-toast-message";

const ContactUs = () => {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    if (!firstName || !lastName || !topic || !description) {
      Toast.show({
        type: "error",
        text1: "All fields are required",
      });
      return;
    }

    // show toast
    Toast.show({
      type: "success",
      text1: "Message sent successfully!",
      text2: `Thanks ${firstName}, we'll reach out soon.`,
    });

    // clear inputs
    setFirstName("");
    setLastName("");
    setTopic("");
    setDescription("");
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-between w-[90%] mx-auto mt-6 pb-4">
        <View>
          <Pressable onPress={() => router.back()}>
            <BackArrow />
          </Pressable>
          <Text className="text-[28px] font-semibold py-4">Contact Us</Text>
          <View className="flex items-center justify-center gap-8">
            <CustomInput
              placeholder="First name"
              value={firstName}
              onChangeText={setFirstName}
            />
            <CustomInput
              placeholder="Last name"
              value={lastName}
              onChangeText={setLastName}
            />
            <CustomInput
              placeholder="Topic"
              value={topic}
              onChangeText={setTopic}
            />
            <CustomInput
              placeholder="Description"
              multiline
              numberOfLines={5}
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </View>
        <CustomButton text="Send Now" onPress={handleSubmit} />
      </View>
    </View>
  );
};

export default ContactUs;
