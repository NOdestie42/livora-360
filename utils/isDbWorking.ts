import instance from "./instance";

const checkDb = async () => {
  try {
    const response = await instance.get("/");
    return response.data;
  } catch (error) {
    return error;
  }
};
export default checkDb;
