import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { RxDotFilled } from "react-icons/rx";
import { Link } from "react-router-dom";
import Marquee from "react-fast-marquee";

const Home: React.FC = () => {
  const images = [
    { src: "/image/LuxeLook10.png" },
    { src: "/image/luxelook2.jpg" },
    { src: "/image/luxelook11.png" },
    { src: "/image/luxelook13.png" },
    { src: "/image/p2.png" },
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
      <div className="max-w-full h-[510px] w-full m-auto relative group mb-5">
        <div
          style={{ backgroundImage: `url(${images[currentIndex].src})` }}
          className="w-full h-full bg-center bg-cover duration-500"
        ></div>

        <div
          onClick={prevSlide}
          className="hidden group-hover:block absolute top-[50%] -translate-y-1/2 left-5 text-2xl rounded-full bg-black/20 text-white cursor-pointer"
        >
          <ChevronLeft size={30} />
        </div>

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

      <div className="flex justify-center items-center gap-4 my-10">
        <div className="text-md font-semibold">New Arrival</div>
        <div className="text-md font-semibold">BestSeller</div>
        <div className="text-md font-semibold">Special</div>
      </div>

      <Marquee>
        <div className="flex gap-16 justify-center flex-wrap mb-10">
          {categories.map((cat, index) => (
            <Link
              key={index}
              to="/productlist"
              className="flex flex-col items-center cursor-pointer"
            >
              <div className="w-25 h-25 overflow-hidden rounded-full flex items-center justify-center shadow">
                <img
                  src={cat.src}
                  alt={cat.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-3 text-sm font-semibold tracking-wide text-gray-700">
                {cat.title}
              </p>
            </Link>
          ))}
        </div>
      </Marquee>
    </>
  );
};

export default Home;
