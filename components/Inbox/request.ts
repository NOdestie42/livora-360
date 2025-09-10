import { getItemFromAsyncStorage } from "@/AsyncStorage";
import { AllMessagesAPITypes } from "@/types";
import instance from "@/utils/instance";


export const AllMessages = async () => {
    const token = await getItemFromAsyncStorage('userToken');
    const SenderId = await getItemFromAsyncStorage('userId');
    const response = await instance.get<AllMessagesAPITypes[]>(
        `/all-messages/${SenderId}`,
        {
            headers: {
                Authorization: token,
            },
        }
    );
    return response.data;
};
