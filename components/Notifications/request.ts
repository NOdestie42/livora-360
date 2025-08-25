import { getItemFromAsyncStorage } from "@/AsyncStorage";
import { NotificationSchemaPropsTypes } from "@/types";
import instance from "@/utils/instance";

export const GetNotification = async () => {
  const token = await getItemFromAsyncStorage("userToken");
  const userId = await getItemFromAsyncStorage("userId");

  const response = await instance.get<NotificationSchemaPropsTypes[]>(
    `/get-user-notification/${userId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );

  return response.data;
};
