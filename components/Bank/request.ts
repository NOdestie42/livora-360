import { getItemFromAsyncStorage } from "@/AsyncStorage";
import { UserDataWithCardList } from "@/types";
import instance from "@/utils/instance";

export const UsercardList = async () => {
  const token = await getItemFromAsyncStorage("userToken");
  const userId = await getItemFromAsyncStorage("userId");
  const response = await instance.get<UserDataWithCardList>(
    `/user-card-list/${userId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response.data;
};
