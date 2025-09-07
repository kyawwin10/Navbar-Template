import { axiosInstance } from "../axiosInstance";
import type { getAllProductPayload, productGetByIdPayload, productPayload } from "./types";

const baseURL = '/api';

export const getAllProduct = async (params: getAllProductPayload ) : Promise<productPayload[]> => {
    const response = await axiosInstance.get(`${baseURL}/Product`, { params });
    return response.data.data;
}

export const getByIdProduct = async (params: productGetByIdPayload) : Promise<productPayload> => {
    const response = await axiosInstance.get(`${baseURL}/Product/${params.id}`);
    return response.data.data;
}

export default { getAllProduct, getByIdProduct }