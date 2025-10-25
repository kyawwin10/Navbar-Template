import { addOrders } from "@/api/order/queries";
import type { orderAddPayload } from "@/api/order/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { RootState } from "@/store";
import { clearCart } from "@/store/feature/cartSlice";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const Order: React.FC = () => {
  const [fullName, setFullName] = useState("");
  const [region, setRegion] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [township, setTownship] = useState("");
  const [address, setAddress] = useState("");
  const [paymentType, setPaymentType] = useState("CashOnDelivery");
  const [deliFee, setDeliFee] = useState(2000);
  const dispatch = useDispatch();

  const cart = useSelector((state: RootState) => state.cart.items);
  const subTotal = cart.reduce(
    (sum, item) => sum + item.price * item.stockQTY,
    0
  );

  const { mutate: addOrder } = addOrders.useAddOrder({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Place Order Successfully");
      alert("Place Order Successfully");
      dispatch(clearCart());
      setFullName("");
      setRegion("");
      setPhoneNumber("");
      setCity("");
      setTownship("");
      setAddress("");
    },
  });

  const handlePlaceOrder = () => {
    if (
      !fullName ||
      !phoneNumber ||
      !region ||
      !city ||
      !township ||
      !address
    ) {
      alert("Please fill Delivery Information in all required fields");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }
    const payload: orderAddPayload = {
      fullName,
      region,
      phoneNumber,
      city,
      township,
      address,
      paymentType,
      deliFee,
      orderDetails: cart.map((item) => ({
        productId: item.productId,
        qty: item.stockQTY,
      })),
    };
    addOrder(payload);
  };

  // Calculate if free delivery applies
  const isFreeDelivery = subTotal >= 500000;
  const finalDeliFee = isFreeDelivery ? 0 : deliFee;
  const total = subTotal + finalDeliFee;

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
            SHIPPING ADDRESS
          </h2>

          <form className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Region <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Township <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={township}
                  onChange={(e) => setTownship(e.target.value)}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2">Payment Type</Label>
                <select
                  className="border rounded-md w-full p-2"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                >
                  <option value="CashOnDelivery">Cash On Delivery</option>
                  <option value="paypal">Paypal</option>
                  <option value="stripe">Stripe</option>
                </select>
              </div>
              <div>
                <Label className="mb-2">Delivery Fee</Label>
                <input
                  disabled={isFreeDelivery}
                  type="number"
                  value={isFreeDelivery ? 0 : deliFee}
                  onChange={(e) => setDeliFee(Number(e.target.value))}
                  className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500 disabled:bg-[#ffffff] disabled:text-gray-500"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="flex flex-col">
          <div className="bg-[#ffffff] rounded-xl shadow p-6 max-h-80 overflow-y-auto">
            <h2 className="text-md font-bold mb-4 text-[#731212] border-b pb-2">
              ORDER SUMMARY
            </h2>

            {/* Loop through cart items */}
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex justify-between items-center mb-3 border-b pb-3"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src="image/p1.jpg"
                    // src={item.productImageUrl}
                    alt="image"
                    className="w-16 h-16 rounded-md border"
                  />
                  <div>
                    <p className="font-semibold text-gray-700">
                      {item.productName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.stockQTY}
                    </p>
                  </div>
                </div>
                <span className="font-bold text-gray-800">
                  {item.price * item.stockQTY} {item.currencySymbol}
                </span>
              </div>
            ))}

            {/* Totals */}
            <div className="flex justify-between font-semibold text-[#731212] text-md mt-4">
              <span>Subtotal</span>
              <span>{subTotal}</span>
            </div>
            <div className="flex justify-between text-[#731212] font-semibold text-md">
              <span className="basis-[65%]">
                Delivery Fee
                {isFreeDelivery && (
                  <span className="ml-2 text-green-600 font-normal text-sm">
                    (Free delivery for orders over 500,000)
                  </span>
                )}
              </span>
              <span className="basis-[35%] flex justify-end">{finalDeliFee}</span>
            </div>
            <div className="flex justify-between font-semibold text-[#731212] text-md mt-2">
              <span>Total</span>
              <span>{total}</span>
            </div>
          </div>
          <div>
            <Button
              onClick={handlePlaceOrder}
              className="w-full mt-4 bg-[#e95a07] hover:bg-gray-500 text-[#731212] text-md font-semibold py-2 px-4 rounded-md transition"
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Order;
