import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { favouriteListPayload, orderAddPayload, orderDetailsPayload } from "./types";
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

export const favouriteOrderDetails = {
  useAddToFavourite: (
    opt?: UseMutationOptions<any, Error, favouriteListPayload[], unknown>
  ) =>
    useMutation<any, Error, favouriteListPayload[], unknown>({
      mutationKey: ["favouriteOrderDetails"],
      mutationFn: OrderServices.addToFavourite,
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