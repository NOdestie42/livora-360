import { getItemFromAsyncStorage } from "@/AsyncStorage";
import { NotificationSchemaPropsTypes } from "@/types";
import instance from "@/utils/instance";

export const GetNotification = async () => {
  const token = await getItemFromAsyncStorage("userToken");
  const userId = await getItemFromAsyncStorage("userId");

  console.log("Fetching notifications for userId:", userId); // Add this
  console.log("Using token:", token); // Add this

  if (!userId) {
    console.error("userId not found in AsyncStorage");
    return []; // Or throw an error
  }

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