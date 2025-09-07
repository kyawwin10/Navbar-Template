import { getBookingList } from "@/api/booking/queries";
import React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const Booking: React.FC = () => {
  const {
    data: bookingList,
    isFetching,
    error,
    isError,
    isLoading,
  } = getBookingList.useGetBookingList();
  return (
    <>
      {/* Loading State */}
      {isFetching && <p className="text-center">Loading...</p>}

      {/* Error State */}
      {isError && (
        <p className="text-center text-red-500 font-semibold">
          An error has occurred: {error?.message}
        </p>
      )}
        <h1 className="text-md font-semibold text-center mt-4">Booking List</h1>
       <DataTable columns={columns} data={bookingList ?? []} loading={isLoading} />
    </>
  );
};

export default Booking;
