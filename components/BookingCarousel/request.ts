import { getItemFromAsyncStorage } from "@/AsyncStorage";
import { UpdateLike } from "@/types";
import instance from "@/utils/instance";

export const ToggleLike = async (data: UpdateLike) => {
  const token = await getItemFromAsyncStorage("userToken");
  const response = await instance.put(
    "/property-like",
    { propertyId: data.propertyId, liked: data.liked },
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response.data;
};
