import { getItemFromAsyncStorage } from "@/AsyncStorage";
import { BookingSchemaPropsTypes, CancelBookingPropsTypes } from "@/types";
import instance from "@/utils/instance";

export const CancelBooking = async (bookingId: string | string[]) => {
  const token = await getItemFromAsyncStorage("userToken");
  const reponse = await instance.get<BookingSchemaPropsTypes>(
    `cancel-booking-data/${bookingId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return reponse.data;
};

export const CancelBookingWithUpdation = async (
  data: CancelBookingPropsTypes
): Promise<void> => {
  const token = await getItemFromAsyncStorage("userToken");
  await instance.post(
    `/cancel-booking-with-updation`,
    { bookingId: data.bookingId, status: data.status },
    {
      headers: {
        Authorization: token,
      },
    }
  );
};
