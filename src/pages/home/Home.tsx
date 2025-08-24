import React from "react";

const Home = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-br text-black">
        <h1 className="text-6xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-lg">
        Luxe Living
      </h1>
      <p className="mt-6 text-lg text-gray-300 max-w-xl text-center">
        Experience timeless elegance with premium crafted goods for the modern
        lifestyle.
      </p>
      <button className="mt-8 px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-500 to-yellow-700 text-white font-semibold shadow-xl hover:scale-105 transition">
        Explore Collection
      </button>
      </div>
    </>
  );
};

export default Home;
