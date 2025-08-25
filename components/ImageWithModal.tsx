import React, { Dispatch, SetStateAction } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  useWindowDimensions,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

type ImageWithModalProp = {
  isModalVisible: boolean;
  setIsModalVisible: Dispatch<SetStateAction<boolean>>;
};

const ImageWithModal = ({
  isModalVisible,
  setIsModalVisible,
}: ImageWithModalProp) => {
  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  const { height } = useWindowDimensions();
  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleCloseModal}
      statusBarTranslucent={true}
    >
      <Pressable
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: "#00000080" }}
        onPress={handleCloseModal}
      >
        <View
          className="bg-white p-6 rounded-xl w-[90%]"
          style={{
            borderRadius: 10,
            height: height - 200,
          }}
          onStartShouldSetResponder={() => true}
        >
          <Text className="text-xl font-bold text-center mb-4">Save Image</Text>
          {/* <Pressable
            onPress={handleCloseModal}
            className="mt-4 bg-gray-300 py-2 rounded-lg w-full text-center"
          >
            <Text className="font-semibold text-center">Cancel</Text>
          </Pressable> */}
          <TextInput />
        </View>
      </Pressable>
    </Modal>
  );
};

export default ImageWithModal;
