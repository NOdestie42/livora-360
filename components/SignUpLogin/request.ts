import instance from "@/utils/instance";

const loginUser = async (data: { email: string; password: string }) => {
  try {
    const response = await instance.post("/login", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default loginUser;
