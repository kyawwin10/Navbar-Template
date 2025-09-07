import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { RxDotFilled } from "react-icons/rx";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  const images = [
    { src: "/image/LuxeLook10.png" },
    { src: "/image/luxelook2.jpg" },
    { src: "/image/luxelook11.png" },
    { src: "/image/luxelook13.png" },
    { src: "/image/p2.png" },
  ];

  const people = [
    {
      src: "/image/photo_2025-08-29_22-12-50.jpg",
      bg: "bg-gradient-to-r from-pink-400 to-purple-400",
    },
    { src: "/image/photo_2025-08-29_22-13-39.jpg", bg: "bg-pink-200" },
    { src: "/image/photo_2025-08-29_22-13-44.jpg", bg: "bg-blue-400" },
    { src: "/image/solares.png", bg: "bg-orange-300" },
    { src: "/image/download.jpg", bg: "bg-green-300" },
  ];

  const categories = [
    {
      src: "/image/body&bath.jpg",
      title: "Body&Bath",
    },
    {
      src: "/image/men.jpg",
      title: "Men",
    },
    {
      src: "/image/hair.jpg",
      title: "Hair",
    },
    {
      src: "/image/makeup.jpg",
      title: "Makeup",
    },
    {
      src: "/image/sunscreen.jpg",
      title: "Sunscreen",
    },
    {
      src: "/image/wellness.jpg",
      title: "Wellness",
    },
    {
      src: "/image/baby&mom.jpg",
      title: "Baby&Mom",
    },
    {
      src: "/image/skincare.jpg",
      title: "Skincare",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <>
      <div className="max-w-full h-[610px] w-full m-auto relative group mb-5">
        {/* Background Image */}
        <div
          style={{ backgroundImage: `url(${images[currentIndex].src})` }}
          className="w-full h-full bg-center bg-cover duration-500"
        ></div>

        {/* Left Arrow */}
        <div
          onClick={prevSlide}
          className="hidden group-hover:block absolute top-[50%] -translate-y-1/2 left-5 text-2xl rounded-full bg-black/20 text-white cursor-pointer"
        >
          <ChevronLeft size={30} />
        </div>

        {/* Right Arrow */}
        <div
          onClick={nextSlide}
          className="hidden group-hover:block absolute top-[50%] -translate-y-1/2 right-5 text-2xl rounded-full bg-black/20 text-white cursor-pointer"
        >
          <ChevronRight size={30} />
        </div>

        <div className="flex justify-center">
          {images.map((_, slideIndex) => (
            <div
              key={slideIndex}
              onClick={() => goToSlide(slideIndex)}
              className={`text-2xl cursor-pointer ${
                currentIndex === slideIndex ? "text-black" : "text-gray-400"
              }`}
            >
              <RxDotFilled />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 justify-center mt-20 p-4">
        {people.map((person, index) => (
          <div
            key={index}
            className="w-32 h-32 flex items-center justify-center rounded-lg shadow hover:scale-105 transition"
          >
            <div
              className={`w-28 h-28 ${person.bg} rounded-full flex items-center justify-center`}
            >
              <img
                src={person.src}
                alt="profile"
                className="w-24 h-24 object-cover rounded-full border-4 border-white"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-8 justify-center flex-wrap mt-20 mb-10">
        {categories.map((cat, index) => (
          <Link
            key={index}
            to="/productlist"
            className="flex flex-col items-center cursor-pointer"
          >
            {/* Image with oval shape */}
            <div className="w-32 h-48 overflow-hidden rounded-[50%] flex items-center justify-center shadow-md hover:scale-105 transition">
              <img
                src={cat.src}
                alt={cat.title}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Label */}
            <p className="mt-3 text-sm font-semibold tracking-wide text-gray-700">
              {cat.title}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
};

export default Home;
