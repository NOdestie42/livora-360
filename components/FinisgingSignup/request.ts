import { UserInfoTypes } from "@/types";
import instance from "@/utils/instance";

const signUp = async (data: UserInfoTypes) => {
  try {
    const response = await instance.post("/signup", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export default signUp;
