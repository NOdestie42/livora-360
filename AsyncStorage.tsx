import AsyncStorage from "@react-native-async-storage/async-storage";

export const getItemFromAsyncStorage = async (key: string) => {
  const value = await AsyncStorage.getItem(key);
  return value;
};

export const setItemToAsyncStorage = async (key: string, value: string) => {
  await AsyncStorage.setItem(key, value);
};

export const removeItemFromAsyncStorage = async (key: string) => {
  await AsyncStorage.removeItem(key);
};
