import { getItemFromAsyncStorage } from "@/AsyncStorage";
import { MessageSchemaPropsTypes } from "@/types";
import instance from "@/utils/instance";

export const fetchProperties = async ({ pageParam = 1 }, id: any) => {
  const res = await instance.get(
    `/get-single-location?page=${pageParam}&limit=3&id=${id}`
  );
  return res.data;
};

export const FirstTimeChatFunction = async (
  createdBy: string | null,
  propertyId: string | null
) => {
  const token = await getItemFromAsyncStorage("userToken");
  const response = await instance.get<MessageSchemaPropsTypes>(
    `/first-time-chat/${createdBy}/${propertyId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response.data;
};
