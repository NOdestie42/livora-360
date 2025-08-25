import { getItemFromAsyncStorage } from "@/AsyncStorage";
import instance from "@/utils/instance";

export const getSingle = async (id: string | string[]) => {
  try {
    const token = await getItemFromAsyncStorage("userToken");
    const response = await instance.get(`/specific-property/${id}`, {
      headers: {
        Authorization: token,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};
