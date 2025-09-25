import { axiosInstance } from "../axiosInstance";
import type { fileUploadPayload, getAllProductPayload, imageParamUploadPayload, productGetByIdPayload, productPayload } from "./types";

const baseURL = '/api';

export const getAllProduct = async (params: getAllProductPayload ) : Promise<productPayload[]> => {
    const response = await axiosInstance.get(`${baseURL}/Product`, { params });
    return response.data.data;
}

export const getByIdProduct = async (params: productGetByIdPayload) : Promise<productPayload> => {
    const response = await axiosInstance.get(`${baseURL}/Product/${params.id}`);
    return response.data.data;
}

export const addFileUpload = async (params: imageParamUploadPayload): Promise<fileUploadPayload> => {
  const formData = new FormData();
  formData.append("image", params.image);

  const response = await axiosInstance.post<fileUploadPayload>(`${baseURL}/Product/upload`,formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export default { getAllProduct, getByIdProduct, addFileUpload }