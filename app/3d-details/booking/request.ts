import { getItemFromAsyncStorage } from "@/AsyncStorage";
import { BookingSchemaPropsTypes } from "@/types";
import instance from "@/utils/instance";

export const BookingData = async (
  data: BookingSchemaPropsTypes
): Promise<BookingSchemaPropsTypes> => {
  const token = await getItemFromAsyncStorage('userToken');
  const response = await instance.post<BookingSchemaPropsTypes>(
    "/booking-post",
    {
      data,
    },
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response.data;
};
