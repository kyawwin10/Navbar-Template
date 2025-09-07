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

interface Props {
  open: boolean;
  onClose: () => void;
}

const CartDialog: React.FC<Props> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.cart.items);

  // Checkout form state
  const [orderPlace, setOrderPlace] = useState("");
  // const [orderStartPoint, setOrderStartPoint] = useState("");
  // const [orderEndPoint, setOrderEndPoint] = useState("");
  // const [paymentType, setPaymentType] = useState("CashOnDelivery");
  const [deliFee, setDeliFee] = useState(2000);

  const { mutate: confirmOrder, isPending } = addOrders.useAddOrder({
    onSuccess: () => {
      toast.success("Order placed successfully!");
      dispatch(clearCart());
      onClose();
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
      paymentType: "CashOnDelivery",
      // orderStartPoint,
      // orderEndPoint,
      // paymentType,
      deliFee: 2000,
    };
    confirmOrder(payload);
    setOrderPlace("");
    // setOrderStartPoint("");
    // setOrderEndPoint("");
    // setPaymentType("");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto space-y-4 bg-cyan-100/10 rounded-2xl shadow-2xl">
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
                    <p className="font-semibold text-white">
                      {item.productName}
                    </p>
                    <p className="text-sm text-yellow-300">
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
              <div className="space-y-2 pt-4 border-b text-white">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{subTotal}</span>
                </div>
                <div className="flex justify-between border-b">
                  <span>Delivery Fee</span>
                  <span>{deliFee}</span>
                </div>
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{total}</span>
                </div>
              </div>

              {/* Checkout Form */}
              <div className="space-y-3 text-white">
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
                {/* <div>
                  <Label className="mb-2">Payment Type</Label>
                  <select
                    className="border rounded w-full p-2"
                    value={paymentType}
                    onChange={(e) => setPaymentType(e.target.value)}
                  >
                    <option value="CashOnDelivery">Cash On Delivery</option>
                    <option value="KBZPay">KBZ Pay</option>
                    <option value="WavePay">Wave Pay</option>
                  </select>
                </div> */}
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
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6"
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
    </>
  );
};

export default CartDialog;
