import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import BookingService from './services'
import type { getAllDoctorPayload } from "./type";

export const getDoctorList = {
  doctors: (opt?: UseQueryOptions<getAllDoctorPayload[]>) =>
    useQuery({
      queryKey: ["getBookingList"],
      queryFn: BookingService.getAllDoctor,
      ...opt,
    }),
};
