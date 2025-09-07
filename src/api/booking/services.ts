import { axiosInstance } from "../axiosInstance"
import type { getAllBookingPayload } from "./type"

const baseUrl = `/api/Booking`;

const getAllBooking = async () : Promise<getAllBookingPayload[]> => {
    const response = await axiosInstance.get(`${baseUrl}/doctors`);
    return response.data.data;
}

export default {getAllBooking}