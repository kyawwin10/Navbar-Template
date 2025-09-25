import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import {
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
} from "@/store/feature/cartSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addOrders } from "@/api/order/queries";
import type { orderAddPayload } from "@/api/order/types";
import toast from "react-hot-toast";
import { CircleMinus, CirclePlus } from "lucide-react";
import { clearFavourite, decreasementQty, increasementQty, removeFromFavourite } from "@/store/feature/favouriteSlice";

interface Props {
  cartOpen: boolean;
  favouriteOpen: boolean;
  onCartClose: () => void;
  onFavClose: () => void;
}

const CartDialog: React.FC<Props> = ({ cartOpen, favouriteOpen, onCartClose, onFavClose }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);
  const favaurite = useSelector((state: RootState) => state.favourite.items);

  const [orderPlace, setOrderPlace] = useState("");
  // const [orderStartPoint, setOrderStartPoint] = useState("");
  // const [orderEndPoint, setOrderEndPoint] = useState("");
  const [paymentType, setPaymentType] = useState("CashOnDelivery");
  const [deliFee, setDeliFee] = useState(2000);

  const { mutate: confirmOrder, isPending } = addOrders.useAddOrder({
    onSuccess: () => {
      toast.success("Order placed successfully!");
      dispatch(clearCart());
      dispatch(clearFavourite());
      onCartClose();
      onFavClose();
    },
    onError: (err: any) => {
      toast.error(`Failed to place order: ${err.message}`);
    },
  });

  const subTotal = cart.reduce(
    (sum, item) => sum + item.price * item.stockQTY,
    0
  );
  const total = subTotal + deliFee;

  const handleCheckout = () => {
    if (cart.length === 0) {
      onCartClose();
      toast.error("Your cart is empty!");
      return;
    }
    if (!orderPlace) {
      toast.error("Please fill all order information!");
      return;
    }

    const payload: orderAddPayload = {
      orderDetails: cart.map((item) => ({
        productId: item.productId,
        qty: item.stockQTY,
      })),
      orderPlace,
      orderStartPoint: "Warehouse A",
      orderEndPoint: "Customer Address",
      // paymentType: "CashOnDelivery",
      // orderStartPoint,
      // orderEndPoint,
      paymentType,
      deliFee: 2000,
    };
    confirmOrder(payload);
    setOrderPlace("");
    // setOrderStartPoint("");
    // setOrderEndPoint("");
    setPaymentType("");
  };

  const handleFavCheckout = () => {
    if (cart.length === 0) {
      onFavClose();
      toast.error("Your cart is empty!");
      return;
    }
    if (!orderPlace) {
      toast.error("Please fill all order information!");
      return;
    }

    const payload: orderAddPayload = {
      orderDetails: cart.map((item) => ({
        productId: item.productId,
        qty: item.stockQTY,
      })),
      orderPlace,
      orderStartPoint: "Warehouse A",
      orderEndPoint: "Customer Address",
      // paymentType: "CashOnDelivery",
      // orderStartPoint,
      // orderEndPoint,
      paymentType,
      deliFee: 2000,
    };
    confirmOrder(payload);
    setOrderPlace("");
    // setOrderStartPoint("");
    // setOrderEndPoint("");
    setPaymentType("");
  };

  return (
    <>
      <Dialog open={cartOpen} onOpenChange={onCartClose}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto space-y-4 bg-white rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle>Your Cart</DialogTitle>
          </DialogHeader>

          {cart.length === 0 ? (
            <p className="text-center text-2xl text-pink-500">Cart is empty</p>
          ) : (
            <>
              {/* Cart Items */}
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between items-center border-b"
                >
                  <div>
                    <p className="font-semibold text-[#731212]">
                      {item.productName}
                    </p>
                    <p className="text-md font-semibold text-[#731212]">
                      {item.price} {item.currencySymbol} × {item.stockQTY}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => dispatch(decreaseQty(item.productId))}
                    >
                      <CircleMinus />
                    </Button>
                    <span>{item.stockQTY}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => dispatch(increaseQty(item.productId))}
                    >
                      <CirclePlus />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => dispatch(removeFromCart(item.productId))}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}

              {/* Totals */}
              <div className="space-y-2 pt-4 border-b text-[#731212]">
                <div className="flex justify-between">
                  <span className="text-[#731212]">Subtotal</span>
                  <span className="text-[#731212]">{subTotal}</span>
                </div>
                <div className="flex justify-between border-b">
                  <span className="text-[#731212]">Delivery Fee</span>
                  <span className="text-[#731212]">{deliFee}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-[#731212]">Total</span>
                  <span className="text-[#731212]">{total}</span>
                </div>
              </div>

              {/* Checkout Form */}
              <div className="space-y-3 text-[#731212]">
                <div>
                  <Label className="mb-2">Order Place</Label>

                  <Input
                    value={orderPlace}
                    onChange={(e) => setOrderPlace(e.target.value)}
                    placeholder="Enter order place"
                  />
                </div>
                {/* <div>
                  <Label className="mb-2">Start Point</Label>
                  <Input
                    value={orderStartPoint}
                    onChange={(e) => setOrderStartPoint(e.target.value)}
                    placeholder="Enter start point"
                  />
                </div> */}
                {/* <div>
                  <Label className="mb-2">End Point</Label>
                  <Input
                    value={orderEndPoint}
                    onChange={(e) => setOrderEndPoint(e.target.value)}
                    placeholder="Enter end point"
                  />
                </div> */}
                <div>
                  <Label className="mb-2">Payment Type</Label>
                  <select
                    className="border rounded w-full p-2"
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
                  <Input
                    type="text"
                    value={deliFee}
                    onChange={(e) => setDeliFee(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Checkout */}
              <div className="flex justify-end">
                <Button
                  className="bg-gray-300 hover:bg-gray-500 text-[#731212] text-md font-semibold px-6"
                  disabled={isPending}
                  onClick={handleCheckout}
                >
                  {isPending ? "Processing..." : "Proceed to Checkout"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={favouriteOpen} onOpenChange={onFavClose}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto space-y-4 bg-white rounded-2xl shadow-2xl">
          <DialogHeader>
            <DialogTitle>Favourite Product</DialogTitle>
          </DialogHeader>

          {favaurite.length === 0 ? (
            <p className="text-center text-2xl text-pink-500">Cart is empty</p>
          ) : (
            <>
              {/* Cart Items */}
              {favaurite.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between items-center border-b"
                >
                  <div>
                    <p className="font-semibold text-white">
                      {item.productName}
                    </p>
                    <p className="text-md font-semibold text-[#731212]">
                      {item.price} {item.currencySymbol} × {item.stockQTY}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => dispatch(decreasementQty(item.productId))}
                    >
                      <CircleMinus />
                    </Button>
                    <span>{item.stockQTY}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => dispatch(increasementQty(item.productId))}
                    >
                      <CirclePlus />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => dispatch(removeFromFavourite(item.productId))}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}

              {/* Totals */}
              <div className="space-y-2 pt-4 border-b text-[#731212]">
                <div className="flex justify-between">
                  <span className="text-[#731212]">Subtotal</span>
                  <span className="text-[#731212]">{subTotal}</span>
                </div>
                <div className="flex justify-between border-b">
                  <span className="text-[#731212]">Delivery Fee</span>
                  <span className="text-[#731212]">{deliFee}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span className="text-[#731212]">Total</span>
                  <span className="text-[#731212]">{total}</span>
                </div>
              </div>

              {/* Checkout Form */}
              <div className="space-y-3 text-white">
                <div>
                  <Label className="mb-2 text-[#731212]">Order Place</Label>

                  <Input
                    className="text-[#731212]"
                    value={orderPlace}
                    onChange={(e) => setOrderPlace(e.target.value)}
                    placeholder="Enter order place"
                  />
                </div>
                {/* <div>
                  <Label className="mb-2">Start Point</Label>
                  <Input
                    value={orderStartPoint}
                    onChange={(e) => setOrderStartPoint(e.target.value)}
                    placeholder="Enter start point"
                  />
                </div> */}
                {/* <div>
                  <Label className="mb-2">End Point</Label>
                  <Input
                    value={orderEndPoint}
                    onChange={(e) => setOrderEndPoint(e.target.value)}
                    placeholder="Enter end point"
                  />
                </div> */}
                <div>
                  <Label className="mb-2 text-[#731212]">Payment Type</Label>
                  <select
                    className="border rounded w-full p-2 text-[#731212]"
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                  >
                    <option value="CashOnDelivery">Cash On Delivery</option>
                    <option value="paypal">Paypal</option>
                    <option value="stripe">Stripe</option>
                  </select>
                </div>
                <div>
                  <Label className="mb-2 text-[#731212]">Delivery Fee</Label>
                  <Input
                    className="text-[#731212]"
                    type="text"
                    value={deliFee}
                    onChange={(e) => setDeliFee(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  className="bg-gray-300 hover:bg-gray-500 text-[#731212] text-md font-semibold px-6"
                  disabled={isPending}
                  onClick={handleFavCheckout}
                >
                  {isPending ? "Processing..." : "Proceed to Checkout"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartDialog;
