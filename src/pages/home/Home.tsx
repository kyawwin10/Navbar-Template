import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { RxDotFilled } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Home: React.FC = () => {
  const navigate = useNavigate();
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

  const shopClick = () => {
    navigate("/productlist")
  }

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Card 1 */}
        <Card className="flex flex-col md:flex-row items-center md:items-start justify-between p-6 bg-[#f5e9dc] shadow">
          <CardContent className="flex-1 space-y-3 mt-8">
            <p className="text-sm font-medium text-gray-600">500000MMK Buy</p>
            <p className="text-sm font-medium text-gray-600">Delivery Free 1 Get</p>
            <h2 className="text-xl font-semibold">Cosmetic Skin Perfectly</h2>
            <Button onClick={shopClick} className="bg-pink-700 hover:bg-pink-800 text-white rounded-full px-6 mt-4">
              Shop Now
            </Button>
          </CardContent>
          <div className="mt-4 h-full md:mt-0 md:ml-4 flex-shrink-0">
            <img
              src="/image/hair.jpg"
              alt="image"
              className="w-50 md:w-48 object-contain"
            />
          </div>
        </Card>

        {/* Card 2 */}
        <Card className="flex flex-col md:flex-row items-center md:items-start justify-between p-6 bg-[#f5e9dc] shadow">
          <CardContent className="flex-1 space-y-3 mt-14">
            <p className="text-sm font-medium text-gray-600">15% Discount</p>
            <h2 className="text-xl font-semibold">Hydrated Skin Perfectly</h2>
            <Button className="bg-pink-700 hover:bg-pink-800 text-white rounded-full px-6 mt-6">
              Shop Now
            </Button>
          </CardContent>
          <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
            <img
              src="/image/hair.jpg"
              alt="Hydrated Skin"
              className="w-40 md:w-48 object-contain"
            />
          </div>
        </Card>
      </div>

      <div className="flex justify-center items-center gap-4 my-10">
        <div className="text-md font-semibold bg-[#731212] text-white p-1 rounded cursor-pointer hover:bg-[#922222] transition-colors">
          New Arrival
        </div>
        <div className="text-md font-semibold">BestSeller</div>
        <div className="text-md font-semibold">Special</div>
      </div>

      <Marquee>
        <div className="flex gap-10 justify-center flex-wrap mb-10 ml-10">
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

        <div className="flex gap-10 justify-center flex-wrap mb-10 ml-10">
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
