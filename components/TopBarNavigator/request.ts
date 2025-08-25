import { getItemFromAsyncStorage } from "@/AsyncStorage";
import { LocationData } from "@/types";
import instance from "@/utils/instance";

const allProperties = async (title: string): Promise<LocationData[]> => {
  const token = await getItemFromAsyncStorage("userToken");

  if (!token) {
    throw Error("Token not found");
  }

  try {
    const response = await instance.get(`/get-all-properties/${title}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default allProperties;
