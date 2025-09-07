import { axiosInstance } from "../axiosInstance";
import type { orderAddPayload, orderDetailsPayload } from "./types";

const baseURL = '/api/Order';

const addToCart = async (payload: orderDetailsPayload[]) => {
    const response = await axiosInstance.post(`${baseURL}/addtocart`, {orderDetails: payload});
    return response.data;
}

const addOrder = async (payload: orderAddPayload): Promise<any> => {
    const response = await axiosInstance.post(`${baseURL}/add`, payload);
    return response.data;
}

export default { addToCart, addOrder };