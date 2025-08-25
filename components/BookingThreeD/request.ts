import { getItemFromAsyncStorage } from "@/AsyncStorage";
import { LocationData, ReservedPropertiesDate } from "@/types";
import instance from "@/utils/instance";

export const BookingPropertyFunction = async (properId: string | string[]) => {
  const token = await getItemFromAsyncStorage("userToken");
  const response = await instance.get<LocationData>(
    `/booking-property-data/${properId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response.data;
};

export const checkingpropertiesdates = async (
  propertyId: string | string[]
) => {
  const token = await getItemFromAsyncStorage("userToken");
  const response = await instance.get<ReservedPropertiesDate>(
    `/checking-properties-dates/${propertyId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response.data;
};
