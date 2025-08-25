import { getItemFromAsyncStorage } from "@/AsyncStorage";
import { UserData } from "@/types";
import instance from "@/utils/instance";

export interface LoginResponse {
  token: string;
}

export interface UpdateData {
  firstName: string;
  email: string;
  bio: string;
}

export interface UpdateImageTypes {
  profilePic: FormData;
}

export const fetchProfile = async (): Promise<UserData> => {
  const token = await getItemFromAsyncStorage("userToken");
  const response = await instance.get<UserData>("/get-profile-data", {
    headers: {
      Authorization: token,
    },
  });
  return response.data;
};

export const updateUser = async (data: UpdateData): Promise<LoginResponse> => {
  const token = await getItemFromAsyncStorage('userToken');
  const response = await instance.patch<LoginResponse>(
    "/edit-profile-data",
    data,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return response.data;
};


// request.ts
export const UpdateImage = async (
  formData: FormData
): Promise<LoginResponse> => {
  const token = await getItemFromAsyncStorage("userToken");

  const response = await instance.patch<LoginResponse>(
    "/update-profile-image",
    formData,
    {
      headers: {
        Authorization: token,
        "Content-Type": "multipart/form-data", // important for RN
      },
    }
  );

  return response.data;
};
