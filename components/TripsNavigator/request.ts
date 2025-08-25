import { getItemFromAsyncStorage } from "@/AsyncStorage";
import { TripListpropstypes } from "@/types";
import instance from "@/utils/instance";

export const TripList = async (status: string) => {
  const token = await getItemFromAsyncStorage("userToken");
  const userId = await getItemFromAsyncStorage("userId");
  
  try {
    const response = await instance.get<TripListpropstypes[]>(
      `/trip-list/${userId}/${status}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
