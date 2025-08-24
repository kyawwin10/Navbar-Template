import React from "react";

const About = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen justify-center items-center bg-white p-10 rounded-2xl shadow-2xl">
        <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
          About Us
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed text-center">
          At <span className="font-semibold">Luxe Living</span>, we believe
          luxury is more than style—it’s a lifestyle. Our curated collection is
          designed to embody sophistication, comfort, and timeless quality.
        </p>
      </div>
    </>
  );
};

export default About;
