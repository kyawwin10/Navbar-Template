import type { categoryGetAllPayload, categoryIdPayload, categoryInstanceWithProductsPayload } from "./types";
import { axiosInstance } from "../axiosInstance";
import type { productPayload } from "../product/types";

const baseURL = '/api/Category';

const getAllCategory = async (): Promise<categoryGetAllPayload[]> => {
    const response = await axiosInstance.get(`${baseURL}/all`);
    return response.data.data;
};

const categoryCatId = async (catId: string): Promise<categoryIdPayload> => {
  const response = await axiosInstance.get(`${baseURL}/instances/${catId}`);
  console.log("Response", response.data.data);
  return response.data.data;
};

const getCategoryInstancesWithProducts = async (catId: string): Promise<categoryInstanceWithProductsPayload[]> => {
  const response = await axiosInstance.get(`/api/Product/withCatInstance/${catId}`);
  return response.data.data;
};

const getProductByCatInstance = async (catId: string): Promise<productPayload[]> => {
  const response = await axiosInstance.get(`/api/Product/getproductbyCatInstance/${catId}`);
  return response.data.data;
};

export default { getAllCategory, categoryCatId, getCategoryInstancesWithProducts, getProductByCatInstance };