import { getItemFromAsyncStorage } from "@/AsyncStorage";
import { UserData, WalletActivitiesTypes } from "@/types";
import instance from "@/utils/instance";

export const WalletUserData = async () => {
  const token = await getItemFromAsyncStorage("userToken");
  const userId = await getItemFromAsyncStorage("userId");
  const response = await instance.get<UserData>(`/wallet-userdata/${userId}`, {
    headers: {
      Authorization: token,
    },
  });
  return response.data;
};

export const UserWalletActivities = async () => {
  const token = await getItemFromAsyncStorage("userToken");
  const userId = await getItemFromAsyncStorage("userId");
  const response = await instance.get<WalletActivitiesTypes>(
    `/user-wallet-activities/${userId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response.data;
};
