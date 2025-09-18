import { axiosInstance } from "../axiosInstance"
import type { getAllDoctorPayload } from "./type";

const baseUrl = `/api/Booking`;

const getAllDoctor = async () : Promise<getAllDoctorPayload[]> => {
    const response = await axiosInstance.get(`${baseUrl}/doctors`);
    return response.data.data;
}

export default {getAllDoctor}