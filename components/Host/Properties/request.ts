import { getItemFromAsyncStorage } from "@/AsyncStorage";
import { AddLocationData, LocationData, UserData } from "@/types";
import instance from "@/utils/instance";

export const fetchAllProperties = async (): Promise<LocationData[]> => {
  const token = await getItemFromAsyncStorage("userToken");
  const response = await instance.get<LocationData[]>("/get-host-properties", {
    headers: {
      Authorization: token,
    },
  });
  return response.data;
};

export const fetchProfile = async (): Promise<UserData> => {
  const token = await getItemFromAsyncStorage("userToken");
  const response = await instance.get<UserData>("/get-profile-data", {
    headers: {
      Authorization: token,
    },
  });
  return response.data;
};

export const addLocation = async (data: AddLocationData) => {
  const token = await getItemFromAsyncStorage("userToken");
  if (!token) throw new Error("User token not found");
  console.log("====================================");
  console.log(data);
  console.log("====================================");
  const transformedFacilities = data.facilities.map((f: string) => ({
    src: "/default.svg",
    tittle: f,
  }));
  
  const formData = new FormData();
  const size = { starting: data.size, ending: data.size };
  formData.append("title", data.title);
  formData.append("type", data.type);
  formData.append("location", JSON.stringify(data.location));
  formData.append("beds", data.beds.toString());
  formData.append("baths", data.baths.toString());
  formData.append("size", JSON.stringify(size));
  formData.append("overview", data.overview);
  formData.append("facilities", JSON.stringify(transformedFacilities));
  formData.append("rent", data.rent.toString());
  formData.append("license", data.license);
  formData.append("furnished", data.furnished === "yes" ? "true" : "false");
  formData.append("link", data.link);
  formData.append("maxpersons", data.maxpersons.toString());

  data.files.forEach((fileItem, index) => {
    formData.append("files", {
      uri: fileItem.uri,
      name: `file_${Date.now()}_${index}.jpg`,
      type: "image/jpeg",
    } as any);
  });

  const response = await instance.post("/save-location", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
