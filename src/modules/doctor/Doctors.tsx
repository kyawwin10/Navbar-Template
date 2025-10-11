import { getDoctorList } from "@/api/doctor/queries";
import { MapPinHouse, Phone } from "lucide-react";
import React from "react";

const Doctors: React.FC = () => {
  const { data: doctorsList, isPending, error } = getDoctorList.doctors();

  if (isPending)
    return (
      <p className="text-center font-semibold">Loading DoctorList......</p>
    );
  if (error)
    return (
      <p className="text-center text-red-500 font-semibold">
        Fail to Doctor List.....
      </p>
    );
  return (
    <>
      <div className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {doctorsList.map((doctor, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
          >
            <div className="flex flex-col items-center justify-center bg-gray-50 md:w-1/2 p-6">
              <img
                // src="/image/LuxeLookLogo.jpg"
                src={doctor.profileImageUrl}
                alt="image"
                className="w-32 h-32 object-cover mb-4"
              />
              <h2 className="text-md font-semibold text-gray-800">
                {doctor.name}
              </h2>
              <p className="text-sm text-gray-500">{doctor.description}</p>
            </div>

            <div className="relative bg-gray-900 text-white md:w-1/2 p-6 space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-2">Contact</h3>
                <div className="flex justify-between items-center">
                  <Phone className="inline-block mr-2" size={16} />
                  <span>{doctor.phoneNumber}</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2">Address</h3>
                <div className="flex justify-between items-center">
                  <MapPinHouse className="inline-block mr-2" size={16} />
                  <p className="text-gray-300">
                    {doctor.storeposition}, {doctor.storeName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Doctors;
