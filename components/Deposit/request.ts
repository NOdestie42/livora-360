import { getItemFromAsyncStorage } from "@/AsyncStorage";
import { DepositCreditCardTypes, HandleCardDefaultProps } from "@/types";
import instance from "@/utils/instance";

export const DepositCardlistFucntion = async () => {
  const token = await getItemFromAsyncStorage("userToken");
  const userId = await getItemFromAsyncStorage("userId");
  const response = await instance.get<DepositCreditCardTypes>(
    `/deposit-Cards-list/${userId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response.data;
};

export const PaymentSheetSetup = async () => {
  const userId = await getItemFromAsyncStorage("userId");
  const response = await instance.get(`/setup-intent/${userId}`);
  return response.data;
};

export const IntentSave = async (setupIntentId: string) => {
  const userId = await getItemFromAsyncStorage("userId");
  const response = await instance.post(`/save-from-intent`, {
    setupIntentId,
    userId,
  });
  return response.data;
};

export const handlePayFn = async (
  DepositeValue: string,
  PrimaryCard: string
) => {
  const userId = await getItemFromAsyncStorage("userId");
  const res = await instance.post("/api/deposit", {
    userId,
    amount: DepositeValue,
    paymentMethodId: PrimaryCard,
  });
  return res;
};

export const handleCardDefault = async (data: HandleCardDefaultProps) => {
  const token = await getItemFromAsyncStorage("userToken");
  try {
    const response = await instance.get(
      `/handleCardDefault/${data.customerID}/${data.paymentMethodId}`,
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

export const handleDeleteUserCard = async (data: HandleCardDefaultProps) => {
  const token = await getItemFromAsyncStorage("userToken");
  try {
    const response = await instance.get(
      `/handleDeleteCard/${data.customerID}/${data.paymentMethodId}`,
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
