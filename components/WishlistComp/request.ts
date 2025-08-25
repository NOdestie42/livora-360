import { getItemFromAsyncStorage } from "@/AsyncStorage";
import { LocationData } from "@/types";
import instance from "@/utils/instance";

export const fetchwishlist = async (): Promise<LocationData[]> => {
  try {
    const token = await getItemFromAsyncStorage("userToken");
    const response = await instance.get<LocationData[]>("/wishlist-property", {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
