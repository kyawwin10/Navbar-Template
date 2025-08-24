import type { OrderItem } from "@/types/order/order";
import React, { useState } from "react";

const Order = () => {
    const [selected, setSelected] = useState<string | null>(null);

  const items: OrderItem[] = [
    { id: "gold", name: "Gold Edition", price: 499 },
    { id: "platinum", name: "Platinum Edition", price: 899 },
    { id: "diamond", name: "Diamond Edition", price: 1499 },
  ];
  return (
    <>
      <h2 className="text-5xl font-bold text-gray-800 mb-10">
        Place Your Order
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full">
        {items.map((item) => (
          <div
            key={item.id}
            className={`cursor-pointer p-6 rounded-2xl shadow-lg border transition transform hover:scale-105 ${
              selected === item.id
                ? "border-yellow-500 bg-white shadow-2xl"
                : "border-gray-300 bg-gray-50"
            }`}
            onClick={() => setSelected(item.id)}
          >
            <h3 className="text-2xl font-semibold text-gray-900">
              {item.name}
            </h3>
            <p className="mt-2 text-lg text-gray-600">{item.price}</p>
          </div>
        ))}
      </div>

      <button
        disabled={!selected}
        className={`mt-10 px-8 py-3 rounded-2xl text-lg font-semibold shadow-xl transition ${
          selected
            ? "bg-gradient-to-r from-yellow-500 to-yellow-700 text-white hover:scale-105"
            : "bg-gray-400 text-gray-200 cursor-not-allowed"
        }`}
      >
        {selected ? `Confirm ${selected} Order` : "Select a Package"}
      </button>
    </>
  );
};

export default Order;
