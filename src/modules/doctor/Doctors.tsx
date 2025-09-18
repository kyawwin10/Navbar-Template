import { getDoctorList } from "@/api/doctor/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
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
      <div className="w-[75%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {doctorsList.map((doctor, index) => (
          <Card
            key={index}
            className="rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader className="flex flex-col items-center text-center">
              <img
                // src={doctor.profileImageUrl}
                src="/image/LuxeLookLogo.jpg"
                alt="image"
                className="w-24 h-24 rounded-full object-cover shadow-md mb-3"
              />
              <CardTitle className="text-xl font-semibold text-gray-800">
                {doctor.name}
              </CardTitle>
              <p className="text-sm text-gray-500 font-semibold">
                {doctor.description}
              </p>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>
                  {doctor.storeposition}, {doctor.storeName}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{doctor.phoneNumber}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{doctor.email}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default Doctors;
