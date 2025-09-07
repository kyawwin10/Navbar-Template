import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { getAllBookingPayload } from "./type";
import BookingService from './services'

export const getBookingList = {
  useGetBookingList: (opt?: UseQueryOptions<getAllBookingPayload[]>) =>
    useQuery({
      queryKey: ["getBookingList"],
      queryFn: BookingService.getAllBooking,
      ...opt,
    }),
};
