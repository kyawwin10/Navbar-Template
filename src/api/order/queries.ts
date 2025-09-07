import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { orderAddPayload, orderDetailsPayload } from "./types";
import OrderServices from "./services";

export const orderDetails = {
  useAddToCart: (
    opt?: UseMutationOptions<any, Error, orderDetailsPayload[], unknown>
  ) =>
    useMutation<any, Error, orderDetailsPayload[], unknown>({
      mutationKey: ["orderDetails"],
      mutationFn: OrderServices.addToCart,
      ...opt,
    }),
};

export const addOrders = {
  useAddOrder: (opt?: UseMutationOptions<any, Error, orderAddPayload, void>) =>
    useMutation({
      mutationKey: ["addOrders"],
      mutationFn: OrderServices.addOrder,
      ...opt,
    }),
};